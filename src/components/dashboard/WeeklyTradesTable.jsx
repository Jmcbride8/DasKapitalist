import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatDate = (dateStr) => {
    try {
        return format(parseISO(dateStr), 'MMM dd');
    } catch {
        return dateStr;
    }
};

export default function WeeklyTradesTable({ trades, selectedWeek }) {
    const weekTrades = useMemo(() => {
        if (!selectedWeek) return [];
        
        try {
            const weekStart = startOfWeek(parseISO(selectedWeek), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
            
            return trades
                .filter(t => {
                    const dateStr = t.income_week || t.close_date || t.open_date;
                    if (!dateStr) return false;
                    try {
                        const d = parseISO(dateStr);
                        return isWithinInterval(d, { start: weekStart, end: weekEnd });
                    } catch {
                        return false;
                    }
                })
                .sort((a, b) => {
                    const dateA = a.income_week || a.close_date || a.open_date;
                    const dateB = b.income_week || b.close_date || b.open_date;
                    return dateA.localeCompare(dateB);
                });
        } catch {
            return [];
        }
    }, [trades, selectedWeek]);

    const stats = useMemo(() => {
        if (weekTrades.length === 0) return null;
        
        const totalProfit = weekTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
        const wins = weekTrades.filter(t => (t.profit || 0) > 0);
        const losses = weekTrades.filter(t => (t.profit || 0) < 0);
        const winRate = weekTrades.length > 0 ? (wins.length / weekTrades.length) * 100 : 0;
        const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.profit, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.profit, 0) / losses.length : 0;
        
        return { totalProfit, winRate, avgWin, avgLoss, wins: wins.length, losses: losses.length };
    }, [weekTrades]);

    if (!selectedWeek || weekTrades.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 text-sm">
                {selectedWeek ? 'No trades for this week.' : 'Select a week to view trades.'}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Week Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">Total P&L</p>
                    <p className={`text-lg font-bold ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(stats.totalProfit)}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">Win Rate</p>
                    <p className="text-lg font-bold text-slate-900">{stats.winRate.toFixed(0)}%</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">Wins/Losses</p>
                    <p className="text-lg font-bold text-slate-900">{stats.wins}/{stats.losses}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">Avg Win</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.avgWin)}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium mb-1">Avg Loss</p>
                    <p className="text-lg font-bold text-rose-600">{formatCurrency(stats.avgLoss)}</p>
                </div>
            </div>

            {/* Trades Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Ticker</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Premium</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekTrades.map((trade, idx) => {
                            const profit = trade.profit || 0;
                            const dateStr = trade.income_week || trade.close_date || trade.open_date;
                            
                            return (
                                <tr key={trade.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-slate-900">{trade.ticker}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{trade.type}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{formatDate(dateStr)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            trade.status === 'Closed' 
                                                ? 'bg-slate-100 text-slate-700' 
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-slate-600">
                                        {trade.open_premium ? formatCurrency(trade.open_premium) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {profit >= 0 ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-rose-600" />
                                            )}
                                            <span className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {formatCurrency(profit)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}