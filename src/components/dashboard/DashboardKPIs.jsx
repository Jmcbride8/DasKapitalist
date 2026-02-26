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

export default function DashboardKPIs({ trades }) {
    const kpis = useMemo(() => {
        if (!trades || trades.length === 0) {
            return {
                totalProfit: 0,
                unrealizedGainLoss: 0,
                avgWeeklyProfit: 0,
                avgAnnualizedProfit: 0
            };
        }

        // Total Profit
        const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);

        // Unrealized (Gains/Losses) - sum of open trades
         const unrealizedGainLoss = trades
             .filter(trade => trade.status === 'Open')
             .reduce((sum, trade) => sum + (trade.profit || 0), 0);

        // Avg Weekly Profit
        const weeks = new Set();
        trades.forEach(trade => {
            if (trade.income_week) weeks.add(trade.income_week);
            else if (trade.open_date) weeks.add(new Date(trade.open_date).toISOString().split('T')[0]);
        });
        const avgWeeklyProfit = weeks.size > 0 ? totalProfit / weeks.size : 0;

        // Avg Annualized Profit (assuming 52 weeks per year)
        const avgAnnualizedProfit = avgWeeklyProfit * 52;

        return {
            totalProfit,
            unrealizedGainLoss,
            avgWeeklyProfit,
            avgAnnualizedProfit
        };
    }, [trades]);

    const kpiData = [
        { label: 'Total Profit', value: kpis.totalProfit, color: kpis.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600' },
        { label: 'Unrealized', value: kpis.unrealizedGainLoss, color: kpis.unrealizedGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600' },
        { label: 'Avg Weekly Profit', value: kpis.avgWeeklyProfit, color: kpis.avgWeeklyProfit >= 0 ? 'text-emerald-600' : 'text-red-600' },
        { label: 'Avg Annualized Profit', value: kpis.avgAnnualizedProfit, color: kpis.avgAnnualizedProfit >= 0 ? 'text-emerald-600' : 'text-red-600' }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {kpiData.map((kpi, idx) => (
                <div key={idx} className="border-b-2 border-slate-300 pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">{kpi.label}</p>
                            <p className={`text-lg font-bold ${kpi.color}`}>{formatCurrency(kpi.value)}</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-emerald-500 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}