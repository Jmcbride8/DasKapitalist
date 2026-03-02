import React, { useMemo, useState } from 'react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WeeklyProfitChart({ trades, onWeekSelect, periodMode = 'weekly' }) {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const chartData = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        const periodMap = {};

        trades.forEach(trade => {
            const date = trade.income_week || trade.open_date;
            if (!date) return;

            let periodKey;
            if (periodMode === 'monthly') {
                const d = new Date(date);
                periodKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
                periodKey = date;
            }

            if (!periodMap[periodKey]) {
                periodMap[periodKey] = { period: periodKey, net: 0 };
            }

            const profit = trade.profit || 0;
            periodMap[periodKey].net += profit;
        });

        return Object.values(periodMap).sort((a, b) => new Date(a.period) - new Date(b.period));
    }, [trades, periodMode]);

    const formatCurrency = (value) => {
        if (value === 0) return '$0k';
        const absValue = Math.abs(value);
        const formatted = (absValue / 1000).toFixed(0);
        return `${value < 0 ? '-' : ''}$${formatted}k`;
    };

    const formatPeriod = (date) => {
        const d = new Date(date);
        if (periodMode === 'monthly') {
            return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-slate-900 mb-2">{formatPeriod(data.period)}</p>
                    <p className="font-semibold text-slate-900">Net: {formatCurrency(data.net)}</p>
                </div>
            );
        }
        return null;
    };

    const renderWeeklyLabel = (props) => {
        const { x, y, width, value, index } = props;
        if (value === 0) return null;
        const entry = chartData[index];
        const color = entry?.net >= 0 ? '#10b981' : '#ef4444';
        const labelY = entry?.net >= 0 ? y - 5 : y + 13;
        return (
            <text key={index} x={x + width / 2} y={labelY} textAnchor="middle" fontSize={10} fill={color} fontWeight="600">
                {formatCurrency(value)}
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

    const handleBarClick = (data) => {
        if (selectedWeek === data.period) {
            setSelectedWeek(null);
            if (onWeekSelect) onWeekSelect(null);
        } else {
            setSelectedWeek(data.period);
            if (onWeekSelect) onWeekSelect(data.period);
        }
    };

    return (
        <div className="h-[576px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="period"
                        tickFormatter={formatPeriod}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        className="[&_text]:hidden md:[&_text]:block [&_line]:hidden md:[&_line]:block"
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                        className="[&_text]:hidden md:[&_text]:block [&_line]:hidden md:[&_line]:block"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="net" 
                        radius={[4, 4, 0, 0]} 
                        label={renderWeeklyLabel}
                        onClick={(state) => handleBarClick(state.payload)}
                        style={{ cursor: 'pointer' }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.net >= 0 ? '#10b981' : '#ef4444'}
                                opacity={selectedWeek ? (selectedWeek === entry.period ? 1 : 0.3) : 1}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}