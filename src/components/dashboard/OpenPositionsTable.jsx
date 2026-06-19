import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fmtCurrency = (v) => {
    if (!v && v !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
};

const fmtDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
};

export default function OpenPositionsTable({ trades, selectedTicker }) {
    const filteredTrades = useMemo(() => {
        if (!selectedTicker) return [];
        return trades
            .filter(t => t.ticker === selectedTicker && t.status === 'Open')
            .sort((a, b) => new Date(b.open_date) - new Date(a.open_date));
    }, [trades, selectedTicker]);

    const kpis = useMemo(() => {
        const totalOpen = filteredTrades.reduce((s, t) => s + (t.collateral_start || 0), 0);
        const totalUnrealized = filteredTrades.reduce((s, t) => s + (t.profit || 0), 0);
        const gainPct = totalOpen > 0 ? (totalUnrealized / totalOpen) * 100 : 0;

        return { totalOpen, totalUnrealized, gainPct };
    }, [filteredTrades]);

    if (!selectedTicker) {
        return (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                Select a ticker to view positions
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Capital</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{fmtCurrency(kpis.totalOpen)}</div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unrealized P&L</div>
                    <div className={`text-lg font-bold ${kpis.totalUnrealized >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {fmtCurrency(kpis.totalUnrealized)}
                    </div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Return %</div>
                    <div className={`text-lg font-bold ${kpis.gainPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {kpis.gainPct >= 0 ? '+' : ''}{kpis.gainPct.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Positions Table */}
            <div className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Account</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Type</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Open Date</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Expiration</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-right">Open Capital</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-right">Unrealized</TableHead>
                            <TableHead className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-right">Return %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTrades.map(trade => {
                            const openCap = trade.collateral_start || 0;
                            const unrealized = trade.profit || 0;
                            const returnPct = openCap > 0 ? (unrealized / openCap) * 100 : 0;
                            return (
                                <TableRow key={trade.id} className="border-b border-slate-100 dark:border-zinc-700/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                                    <TableCell className="text-sm font-medium text-slate-900 dark:text-white">{trade.account || '-'}</TableCell>
                                    <TableCell className="text-sm font-medium text-slate-900 dark:text-white">{trade.type}</TableCell>
                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">{fmtDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">{fmtDate(trade.expiration)}</TableCell>
                                    <TableCell className="text-sm text-right font-semibold text-slate-900 dark:text-white">
                                        {fmtCurrency(openCap)}
                                    </TableCell>
                                    <TableCell className={`text-sm text-right font-semibold ${unrealized >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {fmtCurrency(unrealized)}
                                    </TableCell>
                                    <TableCell className={`text-sm text-right font-semibold ${returnPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(1)}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {filteredTrades.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-sm">No open positions for {selectedTicker}</div>
                )}
            </div>
        </div>
    );
}