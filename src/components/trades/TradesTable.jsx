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
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80">
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Account</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Type</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Ticker</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Open Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Expiration</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Strike Price</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Open</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Collateral Start</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Potential Yield</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Close</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Close Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Income Week</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Close Type</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Collateral Gain</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-right">Profit</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-center">Actions</TableHead>
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
                            visibleTrades.map((trade) => (
                                <TableRow key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <Badge variant={trade.status === 'Closed' ? 'secondary' : 'default'} 
                                               className={trade.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}>
                                            {trade.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{trade.account || '-'}</TableCell>
                                    <TableCell className="text-slate-700 font-medium">{trade.type}</TableCell>
                                    <TableCell className="font-semibold text-slate-900">{trade.ticker}</TableCell>
                                    <TableCell className="text-slate-600">{formatDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-slate-600">{formatDate(trade.expiration)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700">{formatCurrency(trade.strike_price)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700">{formatCurrency(trade.open_premium)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700">{formatCurrency(trade.collateral_start)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700">{formatPercent(trade.potential_yield)}</TableCell>
                                    <TableCell className={`text-right font-mono ${trade.close_premium < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.close_premium)}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{formatDate(trade.close_date)}</TableCell>
                                    <TableCell className="text-slate-600">{formatDate(trade.income_week)}</TableCell>
                                    <TableCell className="text-slate-600">{trade.close_type || '-'}</TableCell>
                                    <TableCell className={`text-right font-mono ${trade.collateral_gain > 0 ? 'text-emerald-600' : trade.collateral_gain < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.collateral_gain)}
                                    </TableCell>
                                    <TableCell className={`text-right font-mono font-semibold ${trade.profit > 0 ? 'text-emerald-600' : trade.profit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.profit)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" onClick={() => onEdit(trade)}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => onDelete(trade.id)}>
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}