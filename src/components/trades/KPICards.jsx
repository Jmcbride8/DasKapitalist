import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return num < 0 ? `(${formatted})` : formatted;
};

export default function KPICards({ trades }) {
    const calculateProfit = (trade) => (trade.open_premium || 0) + (trade.close_premium || 0) + (trade.collateral_gain || 0);

    // Calculate max cumulative profit
    const groupedByStatusAndWeek = {};
    trades.forEach(trade => {
        const status = trade.status || 'Unknown';
        const week = trade.income_week || 'Unspecified';
        if (!groupedByStatusAndWeek[status]) {
            groupedByStatusAndWeek[status] = {};
        }
        if (!groupedByStatusAndWeek[status][week]) {
            groupedByStatusAndWeek[status][week] = [];
        }
        groupedByStatusAndWeek[status][week].push(trade);
    });

    const allWeekData = [];
    Object.keys(groupedByStatusAndWeek).forEach(status => {
        Object.entries(groupedByStatusAndWeek[status]).forEach(([week, weekTrades]) => {
            const weeklyProfit = weekTrades.reduce((sum, t) => sum + calculateProfit(t), 0);
            allWeekData.push({ status, week, weeklyProfit });
        });
    });

    const sortedChronologically = [...allWeekData].sort((a, b) => {
        const dateA = a.week && a.week !== 'Unspecified' ? new Date(a.week).getTime() : -Infinity;
        const dateB = b.week && b.week !== 'Unspecified' ? new Date(b.week).getTime() : -Infinity;
        return dateA - dateB;
    });

    let maxCumulativeProfit = 0;
    sortedChronologically.forEach(item => {
        maxCumulativeProfit += item.weeklyProfit;
    });
    const allTimeHigh = maxCumulativeProfit;

    // Total last year (2025)
    const lastYearProfit = trades
        .filter(trade => {
            const year = trade.income_week ? new Date(trade.income_week).getFullYear() : null;
            return year === 2025;
        })
        .reduce((sum, trade) => sum + calculateProfit(trade), 0);

    // Total this year (2026)
    const thisYearProfit = trades
        .filter(trade => {
            const year = trade.income_week ? new Date(trade.income_week).getFullYear() : null;
            return year === 2026;
        })
        .reduce((sum, trade) => sum + calculateProfit(trade), 0);

    const kpis = [
        { label: 'Peak Trade Profit', value: allTimeHigh },
        { label: '2025 Total', value: lastYearProfit },
        { label: '2026 Total', value: thisYearProfit }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {kpis.map((kpi, idx) => (
                <Card key={idx} className="bg-white border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</p>
                                <p className={`text-2xl font-bold mt-2 font-mono ${
                                    kpi.value > 0 ? 'text-emerald-600' : kpi.value < 0 ? 'text-red-600' : 'text-slate-900'
                                }`}>
                                    {formatCurrency(kpi.value)}
                                </p>
                            </div>
                            <TrendingUp className={`h-5 w-5 ${
                                kpi.value > 0 ? 'text-emerald-600' : kpi.value < 0 ? 'text-red-600' : 'text-slate-400'
                            }`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}