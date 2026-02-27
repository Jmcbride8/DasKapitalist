import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';

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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-slate-900 mb-2">{formatWeek(data.week)}</p>
                    <p className="font-semibold text-slate-900">Net: {formatCurrency(data.net)}</p>
                </div>
            );
        }
        return null;
    };

    const WeeklyLabel = ({ data, formatter }) => (props) => {
        const { x, y, width, value, index } = props;
        if (value === 0) return null;
        const entry = data[index];
        const color = entry?.net >= 0 ? '#10b981' : '#ef4444';
        const labelY = entry?.net >= 0 ? y - 5 : y + 13;
        return (
            <text x={x + width / 2} y={labelY} textAnchor="middle" fontSize={10} fill={color} fontWeight="600">
                {formatter(value)}
            </text>
        );
    };

    if (chartData.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center text-slate-400">
                Add trades to see weekly profit chart
            </div>
        );
    }

    return (
        <div className="h-[576px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                    <Bar dataKey="net" radius={[4, 4, 0, 0]} label={<WeeklyLabel data={chartData} formatter={formatCurrency} />}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.net >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}