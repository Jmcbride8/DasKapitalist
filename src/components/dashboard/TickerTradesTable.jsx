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

export default function TickerTradesTable({ trades, selectedTicker }) {
    const filteredTrades = useMemo(() => {
        if (!selectedTicker) return [];
        return trades
            .filter(t => t.ticker === selectedTicker)
            .sort((a, b) => new Date(b.open_date) - new Date(a.open_date));
    }, [trades, selectedTicker]);

    const kpis = useMemo(() => {
        const totalProfit = filteredTrades.reduce((s, t) => s + (t.profit || 0), 0);
        const closedTrades = filteredTrades.filter(t => t.status === 'Closed');
        const wins = closedTrades.filter(t => (t.profit || 0) > 0);
        const losses = closedTrades.filter(t => (t.profit || 0) < 0);
        const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
        const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.profit, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.profit, 0) / losses.length : 0;

        return { totalProfit, winRate, avgWin, avgLoss, closedCount: closedTrades.length };
    }, [filteredTrades]);

    if (!selectedTicker) {
        return (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                Select a ticker to view trades
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="text-xs text-slate-500 mb-1">Total P&L</div>
                    <div className={`text-lg font-bold ${kpis.totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {fmtCurrency(kpis.totalProfit)}
                    </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="text-xs text-slate-500 mb-1">Win Rate</div>
                    <div className="text-lg font-bold text-slate-900">{kpis.winRate.toFixed(0)}%</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="text-xs text-slate-500 mb-1">Avg Win</div>
                    <div className="text-lg font-bold text-emerald-600">{fmtCurrency(kpis.avgWin)}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="text-xs text-slate-500 mb-1">Avg Loss</div>
                    <div className="text-lg font-bold text-rose-600">{fmtCurrency(kpis.avgLoss)}</div>
                </div>
            </div>

            {/* Trades Table */}
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            <TableHead className="text-xs text-slate-500 font-semibold">Type</TableHead>
                            <TableHead className="text-xs text-slate-500 font-semibold">Open Date</TableHead>
                            <TableHead className="text-xs text-slate-500 font-semibold">Status</TableHead>
                            <TableHead className="text-xs text-slate-500 font-semibold text-right">Gain (%)</TableHead>
                            <TableHead className="text-xs text-slate-500 font-semibold text-right">Profit/Loss</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTrades.map(trade => {
                            const openValue = trade.collateral_start || 0;
                            const gain = openValue > 0 ? ((trade.profit || 0) / openValue) * 100 : 0;
                            return (
                                <TableRow key={trade.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <TableCell className="text-sm font-medium text-slate-900">{trade.type}</TableCell>
                                    <TableCell className="text-sm text-slate-600">{fmtDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            trade.status === 'Closed' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {trade.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-right font-semibold text-slate-900">
                                        {gain >= 0 ? '+' : ''}{gain.toFixed(1)}%
                                    </TableCell>
                                    <TableCell className={`text-sm text-right font-semibold ${(trade.profit || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {fmtCurrency(trade.profit || 0)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {filteredTrades.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-sm">No trades for {selectedTicker}</div>
                )}
            </div>
        </div>
    );
}