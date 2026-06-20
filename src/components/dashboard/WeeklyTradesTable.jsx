import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
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
        
        return trades
            .filter(t => {
                const tradeWeek = t.income_week || t.open_date;
                return tradeWeek === selectedWeek;
            })
            .sort((a, b) => {
                const dateA = a.income_week || a.close_date || a.open_date;
                const dateB = b.income_week || b.close_date || b.open_date;
                return dateA.localeCompare(dateB);
            });
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
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total P&L</p>
                    <p className={`text-lg font-bold ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {formatCurrency(stats.totalProfit)}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Win Rate</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.winRate.toFixed(0)}%</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Wins/Losses</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.wins}/{stats.losses}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Avg Win</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.avgWin)}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Avg Loss</p>
                    <p className="text-lg font-bold text-rose-500">{formatCurrency(stats.avgLoss)}</p>
                </div>
            </div>

            {/* Trades Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Ticker</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Gain (%)</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekTrades.map((trade, idx) => {
                            const profit = trade.profit || 0;
                            const dateStr = trade.income_week || trade.close_date || trade.open_date;
                            
                            return (
                                <tr key={trade.id || idx} className="border-b border-slate-100 dark:border-zinc-700/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-slate-900 dark:text-white">{trade.ticker}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{trade.type}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{formatDate(dateStr)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            trade.status === 'Closed' 
                                                ? 'bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-slate-300' 
                                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                                        }`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-slate-600 dark:text-slate-400">
                                        {trade.collateral_start && trade.profit !== undefined
                                            ? `${((trade.profit / trade.collateral_start) * 100).toFixed(2)}%`
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {profit >= 0 ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-rose-500" />
                                            )}
                                            <span className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
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