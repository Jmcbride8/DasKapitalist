import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ProfitChart({ trades }) {
    const chartData = useMemo(() => {
        const tickerMap = {};
        
        trades.forEach(trade => {
            if (!trade.ticker) return;
            
            if (!tickerMap[trade.ticker]) {
                tickerMap[trade.ticker] = { realized: 0, unrealized: 0 };
            }
            
            const profit = trade.profit || 0;
            
            if (trade.status === 'Closed') {
                tickerMap[trade.ticker].realized += profit;
            } else {
                tickerMap[trade.ticker].unrealized += profit;
            }
        });
        
        return Object.entries(tickerMap)
            .map(([ticker, data]) => ({
                ticker,
                realized: data.realized,
                unrealized: data.unrealized,
                total: data.realized + data.unrealized
            }))
            .sort((a, b) => b.total - a.total);
    }, [trades]);

    const formatCurrency = (value) => {
        if (value === 0) return '$0';
        const absValue = Math.abs(value);
        if (absValue >= 1000) {
            return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
        }
        return `${value < 0 ? '-' : ''}$${absValue.toFixed(0)}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const realized = payload.find(p => p.dataKey === 'realized')?.value || 0;
            const unrealized = payload.find(p => p.dataKey === 'unrealized')?.value || 0;
            const total = realized + unrealized;
            
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-emerald-600">Realized: {formatCurrency(realized)}</p>
                        <p className="text-slate-400">Unrealized: {formatCurrency(unrealized)}</p>
                        <p className="font-semibold text-slate-900 pt-1 border-t">Total: {formatCurrency(total)}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center text-slate-400">
                Add trades to see profit chart
            </div>
        );
    }

    return (
        <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                        dataKey="ticker" 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                    />
                    <YAxis 
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                    <Bar dataKey="unrealized" stackId="a" fill="#d1d5db" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="realized" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.realized >= 0 ? '#10b981' : '#ef4444'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}