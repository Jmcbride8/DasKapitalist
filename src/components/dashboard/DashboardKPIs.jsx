import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

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

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8">
            {kpiData.map((kpi, idx) => (
                <div key={idx} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">{kpi.label}</p>
                            <p className={`text-lg font-bold ${kpi.color}`}>
                                {kpi.format === 'percent' ? `${kpi.value >= 0 ? '+' : ''}${kpi.value.toFixed(1)}%` : formatCurrency(kpi.value)}
                            </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-emerald-500 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}