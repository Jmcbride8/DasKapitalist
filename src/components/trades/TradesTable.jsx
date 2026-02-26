import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return num < 0 ? `(${formatted})` : formatted;
};

const formatPercent = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value) * 100;
    if (isNaN(num)) return '-';
    return `${num.toFixed(1)}%`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        return format(new Date(dateStr), 'M/d/yyyy');
    } catch {
        return dateStr;
    }
};

export default function TradesTable({ trades, onEdit, onDelete }) {
    const [visibleCount, setVisibleCount] = useState(20);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setVisibleCount(20);
    }, [trades]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && visibleCount < trades.length) {
            setVisibleCount(prev => Math.min(prev + 20, trades.length));
        }
    };

    const visibleTrades = trades.slice(0, visibleCount);

    return (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="overflow-x-auto max-h-[800px] overflow-y-auto"
                style={{ transform: 'rotateX(180deg)' }}
            >
                <div style={{ transform: 'rotateX(180deg)' }}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80">
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Account</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Type</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Ticker</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Open Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Expiration</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Strike Price</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Open</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Collateral Start</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Potential Yield</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Latest Value</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Close Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Income Week</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2">Close Type</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Collateral Gain</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right">Profit</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={17} className="text-center py-12 text-slate-400">
                                    No trades yet. Add your first trade to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleTrades.map((trade) => {
                                const calculatedProfit = (trade.open_premium || 0) + (trade.close_premium || 0) + (trade.collateral_gain || 0);
                                return (
                                <TableRow key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-2">
                                        <Badge variant={trade.status === 'Closed' ? 'secondary' : 'default'} 
                                               className={`text-xs ${trade.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {trade.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{trade.account || '-'}</TableCell>
                                    <TableCell className="text-slate-700 font-medium text-xs py-2">{trade.type}</TableCell>
                                    <TableCell className="font-semibold text-slate-900 text-xs py-2">{trade.ticker}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.expiration)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.strike_price)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.open_premium)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.collateral_start)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatPercent(trade.potential_yield)}</TableCell>
                                    <TableCell className={`text-right font-mono text-xs py-2 ${trade.close_premium < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.close_premium)}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.close_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.income_week)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{trade.close_type || '-'}</TableCell>
                                    <TableCell className={`text-right font-mono text-xs py-2 ${trade.collateral_gain > 0 ? 'text-emerald-600' : trade.collateral_gain < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.collateral_gain)}
                                    </TableCell>
                                    <TableCell className={`text-right font-mono font-semibold text-xs py-2 ${calculatedProfit > 0 ? 'text-emerald-600' : calculatedProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(calculatedProfit)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100" onClick={() => onEdit(trade)}>
                                                <Pencil className="h-3.5 w-3.5 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50" onClick={() => onDelete(trade.id)}>
                                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>
        </div>
    );
}