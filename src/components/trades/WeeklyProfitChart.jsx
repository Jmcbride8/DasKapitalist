import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WeeklyProfitChart({ trades }) {
    const chartData = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        const weekMap = {};

        trades.forEach(trade => {
            const incomeWeek = trade.income_week || trade.open_date;
            if (!incomeWeek) return;

            if (!weekMap[incomeWeek]) {
                weekMap[incomeWeek] = { week: incomeWeek, net: 0 };
            }

            const profit = trade.profit || 0;
            weekMap[incomeWeek].net += profit;
        });

        return Object.values(weekMap).sort((a, b) => new Date(a.week) - new Date(b.week));
    }, [trades]);

    const formatCurrency = (value) => {
        if (value === 0) return '$0k';
        const absValue = Math.abs(value);
        const formatted = (absValue / 1000).toFixed(0);
        return `${value < 0 ? '-' : ''}$${formatted}k`;
    };

    const formatWeek = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-slate-900 mb-2">{formatWeek(data.week)}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-emerald-600">Positive: {formatCurrency(data.positive)}</p>
                        <p className="text-red-600">Negative: {formatCurrency(data.negative)}</p>
                        <p className="font-semibold text-slate-900 pt-1 border-t">Cumulative: {formatCurrency(data.cumulative)}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center text-slate-400">
                Add trades to see weekly profit chart
            </div>
        );
    }

    const renderNetLabel = (props) => {
        const { x, y, width, height, index, payload } = props;
        if (!chartData[index]) return null;
        
        const data = chartData[index];
        const netValue = data.positive + data.negative;
        const labelY = netValue >= 0 ? y - 10 : y + height + 15;
        const textColor = netValue >= 0 ? '#10b981' : '#ef4444';

        return (
            <text x={x + width / 2} y={labelY} textAnchor="middle" fill={textColor} fontSize={11} fontWeight={600}>
                {formatCurrency(netValue)}
            </text>
        );
    };

    return (
        <div className="h-[576px]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="week"
                        tickFormatter={formatWeek}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="positive" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} label={renderNetLabel} />
                    <Line type="monotone" dataKey="cumulative" stroke="#000000" strokeWidth={2} dot={false} yAxisId="right" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}