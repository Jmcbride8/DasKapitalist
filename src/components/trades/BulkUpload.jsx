import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import * as XLSX from 'xlsx';

export default function BulkUpload({ open, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [failedRows, setFailedRows] = useState([]);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setResult(null);

        try {
            // Parse Excel/CSV file directly in frontend
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

            // Helper to format dates
            const formatDate = (value) => {
                if (!value) return null;
                if (typeof value === 'string') return value;
                // Handle Excel date serial numbers
                if (typeof value === 'number') {
                    const date = XLSX.SSF.parse_date_code(value);
                    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
                }
                return null;
            };

            // Helper to parse numbers
            const parseNumber = (value) => {
                if (!value && value !== 0) return null;
                if (typeof value === 'number') return value;
                if (typeof value === 'string') {
                    // Remove currency symbols, commas, parentheses
                    const cleaned = value.replace(/[$,()]/g, '').trim();
                    const num = parseFloat(cleaned);
                    return isNaN(num) ? null : num;
                }
                return null;
            };

            // Map column names to match our schema
            const extractedData = jsonData.map(row => ({
                status: row['Status'] || row['status'],
                account: row['Account'] || row['account'],
                type: row['Type'] || row['type'],
                ticker: row['Ticker'] || row['ticker'],
                open_date: formatDate(row['Open date'] || row['Open Date'] || row['open_date']),
                expiration: formatDate(row['Expiration'] || row['expiration']),
                strike_price: parseNumber(row['Strike Price'] || row['Strike price'] || row['strike_price']),
                open_price: parseNumber(row['Open'] || row['open'] || row['open_price']),
                collateral_start: parseNumber(row['Collateral Start'] || row['Collateral start'] || row['collateral_start']),
                potential_yield: parseNumber(row['Potential Yield'] || row['Potential yield'] || row['potential_yield']),
                latest_value: parseNumber(row['Close'] || row['close'] || row['latest_value']),
                close_date: formatDate(row['Close date'] || row['Close Date'] || row['close_date']),
                income_week: formatDate(row['Income Week'] || row['Income week'] || row['income_week']),
                close_type: row['Close Type'] || row['Close type'] || row['close_type'],
                collateral_gain: parseNumber(row['Collateral Gain'] || row['Collateral gain'] || row['collateral_gain']),
                profit: parseNumber(row['Profit'] || row['profit'])
            }));

            // Map alternate trade type names and convert percentage values
            const extractedCount = extractedData.length;
            const validTypes = ["Trade", "Covered Call", "Cash Secured Put", "Long Call", "Long Put", "Naked Put", "Naked Call"];
            const validStatuses = ["Open", "Closed"];
            
            const validTrades = [];
            const invalidTrades = [];
            
            extractedData.forEach((trade, index) => {
                const rowNum = index + 2; // +2 because Excel starts at 1 and has header row
                const errors = [];
                
                // Validate required fields
                if (!trade.ticker) errors.push("Missing Ticker");
                if (!trade.type) errors.push("Missing Type");
                if (!trade.open_date) errors.push("Missing Open Date");
                
                // Map and validate type
                let mappedType = trade.type;
                if (trade.type === "Bought Call") mappedType = "Long Call";
                if (trade.type === "Bought Put") mappedType = "Long Put";
                if (trade.type === "Sold Put") mappedType = "Cash Secured Put";
                if (trade.type === "Sold Call") mappedType = "Naked Call";
                
                if (mappedType && !validTypes.includes(mappedType)) {
                    errors.push(`Invalid Type: "${trade.type}"`);
                }
                
                // Validate status
                if (trade.status && !validStatuses.includes(trade.status)) {
                    errors.push(`Invalid Status: "${trade.status}"`);
                }
                
                if (errors.length > 0) {
                    invalidTrades.push({
                        rowNum,
                        ...trade,
                        errors: errors.join(", ")
                    });
                } else {
                    validTrades.push({
                        ...trade,
                        type: mappedType,
                        potential_yield: trade.potential_yield ? trade.potential_yield / 100 : null
                    });
                }
            });

            // Bulk insert valid trades
            if (validTrades.length > 0) {
                await base44.entities.Trade.bulkCreate(validTrades);
            }

            setFailedRows(invalidTrades);
            setResult({ 
                success: true, 
                message: `Successfully imported ${validTrades.length} out of ${extractedCount} trades`,
                details: invalidTrades.length > 0 
                    ? `${invalidTrades.length} rows failed validation. See details below.`
                    : null
            });
            
            setTimeout(() => {
                onSuccess();
                onClose();
                setFile(null);
                setResult(null);
            }, 2000);

        } catch (error) {
            setResult({ 
                success: false, 
                message: error.message || 'An error occurred during upload' 
            });
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (!uploading) {
            setFile(null);
            setResult(null);
            setFailedRows([]);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Bulk Upload Trades</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-medium mb-2">📋 Instructions</p>
                        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                            <li>Upload a CSV or Excel file with your trades</li>
                            <li>Column names should match: Status, Account, Type, Ticker, Open Date, etc.</li>
                            <li>Dates should be in format: MM/DD/YYYY or YYYY-MM-DD</li>
                            <li>Percentages should be numbers (e.g., 12.8 for 12.8%)</li>
                            <li>Currency values should be numbers without $ or commas</li>
                        </ul>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 transition-colors">
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            disabled={uploading}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <div className="flex flex-col items-center gap-3">
                                    <FileSpreadsheet className="w-12 h-12 text-emerald-500" />
                                    <div>
                                        <p className="font-medium text-slate-900">{file.name}</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    {!uploading && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                                setResult(null);
                                            }}
                                        >
                                            Change File
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="w-12 h-12 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-900">Click to upload</p>
                                        <p className="text-sm text-slate-500 mt-1">CSV or Excel files</p>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    {result && (
                        <div className={`flex items-start gap-3 p-4 rounded-lg ${
                            result.success 
                                ? 'bg-emerald-50 border border-emerald-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            {result.success ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`text-sm ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
                                    {result.message}
                                </p>
                                {result.details && (
                                    <p className={`text-xs mt-1 ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {result.details}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {failedRows.length > 0 && (
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                            <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                                <p className="text-sm font-medium text-red-900">Failed Rows ({failedRows.length})</p>
                            </div>
                            <div className="max-h-60 overflow-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Row</th>
                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Ticker</th>
                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Type</th>
                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Open Date</th>
                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Error</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {failedRows.map((row, idx) => (
                                            <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                                                <td className="px-3 py-2 text-slate-600">{row.rowNum}</td>
                                                <td className="px-3 py-2 text-slate-900">{row.ticker || '-'}</td>
                                                <td className="px-3 py-2 text-slate-900">{row.type || '-'}</td>
                                                <td className="px-3 py-2 text-slate-900">{row.open_date || '-'}</td>
                                                <td className="px-3 py-2 text-red-600">{row.errors}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleClose}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import Trades
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}