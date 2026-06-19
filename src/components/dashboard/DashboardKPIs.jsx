import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Activity, TrendingDown, Calendar } from 'lucide-react';

const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export default function DashboardKPIs({ trades, view }) {
    const kpis = useMemo(() => {
        if (!trades || trades.length === 0) {
            return {
                totalProfit: 0,
                unrealizedGainLoss: 0,
                avgWeeklyProfit: 0,
                avgAnnualizedProfit: 0,
                totalInvested: 0,
                unrealizedVsRealized: 0
            };
        }

        const openTrades = trades.filter(t => t.status === 'Open');
        const closedTrades = trades.filter(t => t.status === 'Closed');

        // Total Profit
        const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

        // Unrealized (Gains/Losses) - sum of open trades
        const unrealizedGainLoss = openTrades.reduce((sum, t) => sum + (t.profit || 0), 0);

        // Avg Weekly Profit
        const weeks = new Set();
        trades.forEach(trade => {
            if (trade.income_week) weeks.add(trade.income_week);
            else if (trade.open_date) weeks.add(new Date(trade.open_date).toISOString().split('T')[0]);
        });
        const avgWeeklyProfit = weeks.size > 0 ? totalProfit / weeks.size : 0;

        // Avg Annualized Profit (assuming 52 weeks per year)
        const avgAnnualizedProfit = avgWeeklyProfit * 52;

        // Invested At Risk - sum of -open_premium for open trades
        const investedAtRisk = openTrades.reduce((sum, t) => sum + (-(t.open_premium || 0)), 0);

        // Unrealized % of Realized Profits
        const realizedProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
        const unrealizedVsRealized = realizedProfit !== 0 ? (unrealizedGainLoss / Math.abs(realizedProfit)) * 100 : 0;

        return {
            totalProfit,
            unrealizedGainLoss,
            avgWeeklyProfit,
            avgAnnualizedProfit,
            investedAtRisk,
            unrealizedVsRealized
        };
    }, [trades]);

    const isOpenView = view === 'open';

    const kpiData = [
        {
            label: isOpenView ? 'Invested At Risk' : 'Total Profit',
            value: isOpenView ? kpis.investedAtRisk : kpis.totalProfit,
            color: isOpenView ? 'text-slate-700' : (kpis.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'),
            format: 'currency'
        },
        { label: 'Unrealized', value: kpis.unrealizedGainLoss, color: kpis.unrealizedGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600', format: 'currency' },
        { label: 'Avg Weekly Profit', value: kpis.avgWeeklyProfit, color: kpis.avgWeeklyProfit >= 0 ? 'text-emerald-600' : 'text-red-600', format: 'currency' },
        isOpenView
            ? { label: 'Unrealized % of Realized', value: kpis.unrealizedVsRealized, color: kpis.unrealizedVsRealized >= 0 ? 'text-emerald-600' : 'text-red-600', format: 'percent' }
            : { label: 'Profit Annualized', value: kpis.avgAnnualizedProfit, color: kpis.avgAnnualizedProfit >= 0 ? 'text-emerald-600' : 'text-red-600', format: 'currency' }
    ];

    const icons = [DollarSign, Activity, TrendingUp, Calendar];
    const pillColors = ['emerald', 'slate', 'emerald', 'slate'];

    const getColor = (kpi) => {
        if (kpi.color.includes('emerald')) return 'emerald';
        if (kpi.color.includes('red')) return 'rose';
        return 'slate';
    };

    const colorMap = {
        emerald: 'from-emerald-50/80 to-emerald-100/30 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400',
        rose: 'from-rose-50/80 to-rose-100/30 dark:from-rose-900/30 dark:to-rose-800/20 border-rose-200 dark:border-rose-700/50 text-rose-700 dark:text-rose-400',
        slate: 'from-slate-50/80 to-slate-100/30 dark:from-slate-800/50 dark:to-slate-700/20 border-slate-200 dark:border-slate-600/50 text-slate-700 dark:text-slate-300',
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {kpiData.map((kpi, idx) => {
                const color = getColor(kpi);
                const Icon = icons[idx];
                return (
                    <div key={idx} className={`rounded-xl border bg-gradient-to-br p-4 flex flex-col gap-1 ${colorMap[color]}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{kpi.label}</span>
                            {Icon && <Icon className="w-4 h-4 opacity-60" />}
                        </div>
                        <div className="text-2xl font-bold">
                            {kpi.format === 'percent'
                                ? `${kpi.value >= 0 ? '+' : ''}${kpi.value.toFixed(1)}%`
                                : formatCurrency(kpi.value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}