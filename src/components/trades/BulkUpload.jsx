import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BulkUpload({ open, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

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
            // Upload the file
            const { file_url } = await base44.integrations.Core.UploadFile({ file });

            // Extract data with the Trade schema
            const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
                file_url,
                json_schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            account: { type: "string" },
                            type: { type: "string" },
                            ticker: { type: "string" },
                            open_date: { type: "string" },
                            expiration: { type: "string" },
                            strike_price: { type: "number" },
                            open_premium: { type: "number" },
                            collateral_start: { type: "number" },
                            potential_yield: { type: "number" },
                            close_premium: { type: "number" },
                            close_date: { type: "string" },
                            income_week: { type: "string" },
                            close_type: { type: "string" },
                            collateral_gain: { type: "number" },
                            profit: { type: "number" }
                        }
                    }
                }
            });

            if (extractResult.status === 'error') {
                setResult({ success: false, message: extractResult.details || 'Failed to extract data' });
                setUploading(false);
                return;
            }

            // Map alternate trade type names and convert percentage values
            const extractedCount = Array.isArray(extractResult.output) ? extractResult.output.length : 0;
            const trades = (Array.isArray(extractResult.output) ? extractResult.output : []).map((trade, index) => {
                let mappedType = trade.type;
                // Map "Bought Call" to "Long Call" and "Bought Put" to "Long Put"
                if (trade.type === "Bought Call") mappedType = "Long Call";
                if (trade.type === "Bought Put") mappedType = "Long Put";
                
                return {
                    ...trade,
                    type: mappedType,
                    potential_yield: trade.potential_yield ? trade.potential_yield / 100 : null,
                    _originalIndex: index + 1 // Track original row number
                };
            });

            // Bulk insert trades
            const insertResult = await base44.entities.Trade.bulkCreate(trades);
            const insertedCount = Array.isArray(insertResult) ? insertResult.length : trades.length;

            setResult({ 
                success: true, 
                message: `Successfully imported ${insertedCount} out of ${extractedCount} trades`,
                details: extractedCount > insertedCount 
                    ? `${extractedCount - insertedCount} rows were skipped (possibly due to missing required fields or invalid data)`
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