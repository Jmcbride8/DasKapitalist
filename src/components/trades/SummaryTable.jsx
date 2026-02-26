import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return num < 0 ? `(${formatted})` : formatted;
};

const formatPercent = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value) * 100;
    if (isNaN(num)) return '-';
    return `${num.toFixed(2)}%`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        return format(new Date(dateStr), 'M/d/yyyy');
    } catch {
        return dateStr;
    }
};

export default function SummaryTable({ trades }) {
    // Group trades by status, then by income week
    const groupedByStatusAndWeek = {};
    
    trades.forEach(trade => {
        const status = trade.status || 'Unknown';
        let week = trade.income_week;
        if (!week) {
            week = trade.status === 'Closed' && trade.close_date ? trade.close_date : 'Unspecified';
        }
        
        if (!groupedByStatusAndWeek[status]) {
            groupedByStatusAndWeek[status] = {};
        }
        if (!groupedByStatusAndWeek[status][week]) {
            groupedByStatusAndWeek[status][week] = [];
        }
        groupedByStatusAndWeek[status][week].push(trade);
    });

    // Sort statuses with Open first, then Closed
    const sortedStatuses = Object.keys(groupedByStatusAndWeek).sort((a, b) => {
        if (a === 'Open') return -1;
        if (b === 'Open') return 1;
        return a.localeCompare(b);
    });

    // Calculate summary for each status/week combination
     // First, collect all weeks with their data
     const allWeekData = [];
     sortedStatuses.forEach(status => {
         Object.entries(groupedByStatusAndWeek[status]).forEach(([week, weekTrades]) => {
             const totalCollateral = weekTrades.reduce((sum, t) => sum + (t.collateral_start || 0), 0);
             const totalProfit = weekTrades.reduce((sum, t) => sum + ((t.open_premium || 0) + (t.close_premium || 0) + (t.collateral_gain || 0)), 0);
             const avgYield = weekTrades.length > 0 
                 ? weekTrades.reduce((sum, t) => sum + (t.potential_yield || 0), 0) / weekTrades.length
                 : 0;
             const weeklyProfit = weekTrades.reduce((sum, t) => sum + ((t.open_premium || 0) + (t.close_premium || 0) + (t.collateral_gain || 0)), 0);
             const monthStr = week && week !== 'Unspecified' ? format(new Date(week), 'MMMM yyyy') : 'Unspecified';

             allWeekData.push({
                 status,
                 week,
                 month: monthStr,
                 count: weekTrades.length,
                 totalCollateral,
                 totalProfit,
                 avgYield,
                 weeklyProfit
             });
         });
     });

    // Calculate cumulative based on pure chronological order (by income week, aggregating all statuses per week)
    const weeksMap = new Map();
    allWeekData.forEach(item => {
        const weekKey = item.week;
        if (!weeksMap.has(weekKey)) {
            weeksMap.set(weekKey, []);
        }
        weeksMap.get(weekKey).push(item);
    });

    const sortedWeeks = [...weeksMap.keys()].sort((a, b) => {
        const dateA = a && a !== 'Unspecified' ? new Date(a).getTime() : -Infinity;
        const dateB = b && b !== 'Unspecified' ? new Date(b).getTime() : -Infinity;
        return dateA - dateB;
    });

    let cumulativeProfit = 0;
    const cumulativeMap = {};
    sortedWeeks.forEach((week, weekIndex) => {
        const weekItems = weeksMap.get(week);
        weekItems.forEach(item => {
            cumulativeProfit += item.weeklyProfit;
            const avgWeeklyProfit = weekIndex > 0 ? cumulativeProfit / (weekIndex + 1) : item.weeklyProfit;
            cumulativeMap[`${item.status}-${item.week}`] = {
                cumulativeProfit,
                avgWeeklyProfit
            };
        });
    });

    // Sort for display (Closed first, then Open, oldest weeks first within each status)
    const weeklySummaries = [...allWeekData].sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === 'Closed' ? -1 : 1;
        }
        const dateA = a.week && a.week !== 'Unspecified' ? new Date(a.week).getTime() : -Infinity;
        const dateB = b.week && b.week !== 'Unspecified' ? new Date(b.week).getTime() : -Infinity;
        return dateA - dateB;
    }).map(item => {
        const cumData = cumulativeMap[`${item.status}-${item.week}`];
        return {
            ...item,
            cumulativeProfit: cumData.cumulativeProfit,
            weekCount: cumData.weekCount,
            avgWeeklyProfit: cumData.avgWeeklyProfit
        };
    });

    // Calculate grand totals
    const totalUniqueWeeks = sortedWeeks.filter(w => w !== 'Unspecified').length;
    const grandTotalCumulativeProfit = cumulativeProfit;
    const grandTotals = {
        count: trades.length,
        totalCollateral: trades.reduce((sum, t) => sum + (t.collateral_start || 0), 0),
        totalProfit: trades.reduce((sum, t) => sum + ((t.open_premium || 0) + (t.close_premium || 0) + (t.collateral_gain || 0)), 0),
        avgYield: trades.length > 0 
            ? trades.reduce((sum, t) => sum + (t.potential_yield || 0), 0) / trades.length
            : 0,
        weeklyProfit: trades.reduce((sum, t) => sum + ((t.open_premium || 0) + (t.close_premium || 0) + (t.collateral_gain || 0)), 0),
        avgWeeklyProfit: totalUniqueWeeks > 0 ? grandTotalCumulativeProfit / totalUniqueWeeks : 0
    };

    return (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                     <TableRow>
                         <TableHead className="font-semibold text-slate-700 text-xs py-2">Status</TableHead>
                         <TableHead className="font-semibold text-slate-700 text-xs py-2">Month</TableHead>
                         <TableHead className="font-semibold text-slate-700 text-xs py-2">Income Week</TableHead>
                         <TableHead className="font-semibold text-slate-700 text-xs py-2 text-center">Trades</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Collateral</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Profit</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Cumulative Profit</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Cumulative Weekly Profit</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Weekly Profit</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs py-2 text-right">Avg Yield</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {weeklySummaries.map((summary, idx) => {
                         const showMonth = idx === 0 || weeklySummaries[idx - 1].month !== summary.month;
                         return (
                         <TableRow key={`${summary.status}-${summary.week}`} className="hover:bg-slate-50/50 transition-colors border-b border-slate-200">
                             <TableCell className="text-slate-600 text-xs py-2">
                                 <Badge variant={summary.status === 'Closed' ? 'secondary' : 'default'} 
                                        className={`text-xs ${summary.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                     {summary.status}
                                 </Badge>
                             </TableCell>
                             <TableCell className="text-slate-600 text-xs py-2">{showMonth ? summary.month : ''}</TableCell>
                             <TableCell className="text-slate-600 text-xs py-2">{formatDate(summary.week)}</TableCell>
                            <TableCell className="text-slate-600 text-xs py-2 text-center">{summary.count}</TableCell>
                            <TableCell className={`text-right font-mono text-xs py-2`}>{formatCurrency(summary.totalCollateral)}</TableCell>
                            <TableCell className={`text-right font-mono text-xs py-2 ${summary.totalProfit > 0 ? 'text-emerald-600' : summary.totalProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                {formatCurrency(summary.totalProfit)}
                            </TableCell>
                            <TableCell className={`text-right font-mono text-xs py-2 font-semibold ${summary.cumulativeProfit > 0 ? 'text-emerald-600' : summary.cumulativeProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                {formatCurrency(summary.cumulativeProfit)}
                            </TableCell>
                            <TableCell className={`text-right font-mono text-xs py-2 ${summary.avgWeeklyProfit > 0 ? 'text-emerald-600' : summary.avgWeeklyProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                {formatCurrency(summary.avgWeeklyProfit)}
                            </TableCell>
                            <TableCell className={`text-right font-mono text-xs py-2 ${summary.weeklyProfit > 0 ? 'text-emerald-600' : summary.weeklyProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                {formatCurrency(summary.weeklyProfit)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs py-2 text-slate-600">{formatPercent(summary.avgYield)}</TableCell>
                            </TableRow>
                            );
                            })}
                            <TableRow className="bg-yellow-50 border-t-2 border-slate-300 font-semibold">
                            <TableCell className="text-slate-900 text-xs py-2">Grand Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        <TableCell className="text-slate-900 text-xs py-2 text-center">{grandTotals.count}</TableCell>
                        <TableCell className="text-right font-mono text-xs py-2 text-slate-900">{formatCurrency(grandTotals.totalCollateral)}</TableCell>
                        <TableCell className={`text-right font-mono text-xs py-2 ${grandTotals.totalProfit > 0 ? 'text-emerald-700' : grandTotals.totalProfit < 0 ? 'text-red-700' : 'text-slate-900'}`}>
                            {formatCurrency(grandTotals.totalProfit)}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-xs py-2 ${grandTotals.weeklyProfit > 0 ? 'text-emerald-700' : grandTotals.weeklyProfit < 0 ? 'text-red-700' : 'text-slate-900'}`}>
                            {formatCurrency(grandTotals.weeklyProfit)}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-xs py-2 ${grandTotals.avgWeeklyProfit > 0 ? 'text-emerald-700' : grandTotals.avgWeeklyProfit < 0 ? 'text-red-700' : 'text-slate-900'}`}>
                            {formatCurrency(grandTotals.avgWeeklyProfit)}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-xs py-2 ${grandTotals.weeklyProfit > 0 ? 'text-emerald-700' : grandTotals.weeklyProfit < 0 ? 'text-red-700' : 'text-slate-900'}`}>
                            {formatCurrency(grandTotals.weeklyProfit)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-2 text-slate-900">{formatPercent(grandTotals.avgYield)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}