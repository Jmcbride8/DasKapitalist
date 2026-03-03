import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return num < 0 ? `(${formatted})` : formatted;
};

export default function KPICards({ trades }) {
    const calculateProfit = (trade) => trade.profit || 0;

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

    let cumulativeProfit = 0;
    let maxCumulativeProfit = 0;
    sortedChronologically.forEach(item => {
        cumulativeProfit += item.weeklyProfit;
        maxCumulativeProfit = Math.max(maxCumulativeProfit, cumulativeProfit);
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

    // Weekly average
    const weeks = new Set();
    trades.forEach(trade => {
        if (trade.income_week) weeks.add(trade.income_week);
    });
    const totalProfit = trades.reduce((sum, trade) => sum + calculateProfit(trade), 0);
    const weeklyAverage = weeks.size > 0 ? totalProfit / weeks.size : 0;

    const kpis = [
        { label: 'Peak Trade Profit', value: allTimeHigh },
        { label: '2025 Total', value: lastYearProfit },
        { label: '2026 Total', value: thisYearProfit },
        { label: 'Weekly Average', value: weeklyAverage }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-3 border-l-4 border-slate-200 pl-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                            <p className={`text-lg font-bold mt-0.5 ${kpi.value > 0 ? 'text-emerald-600' : kpi.value < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                {formatCurrency(kpi.value)}
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg ${kpi.value > 0 ? 'bg-emerald-100' : kpi.value < 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                            <TrendingUp className={`w-4 h-4 ${kpi.value > 0 ? 'text-emerald-600' : kpi.value < 0 ? 'text-red-600' : 'text-slate-400'}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}