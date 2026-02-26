import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            .reduce((sum, trade) => {
                const collateralGain = trade.collateral_gain || 0;
                const openPremium = trade.open_premium || 0;
                const closePremium = trade.close_premium || 0;
                return sum + (collateralGain + (openPremium - closePremium));
            }, 0);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiData.map((kpi, idx) => (
                <Card key={idx} className="border-0 shadow-sm bg-white/80 backdrop-blur">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-600">{kpi.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${kpi.color}`}>{formatCurrency(kpi.value)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}