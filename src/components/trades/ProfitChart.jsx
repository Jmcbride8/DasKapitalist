import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useTheme } from '@/lib/ThemeContext';

export default function ProfitChart({ trades, selectedTicker, onTickerSelect }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const realizedFill = isDark ? '#475569' : '#d1d5db';
    const chartData = useMemo(() => {
        const tickerMap = {};
        
        trades.forEach(trade => {
            if (!trade.ticker) return;
            
            if (!tickerMap[trade.ticker]) {
                tickerMap[trade.ticker] = { realized: 0, unrealizedGains: 0, unrealizedLosses: 0 };
            }
            
            const profit = trade.profit || 0;
            
            if (trade.status === 'Closed') {
                tickerMap[trade.ticker].realized += profit;
            } else {
                if (profit >= 0) {
                    tickerMap[trade.ticker].unrealizedGains += profit;
                } else {
                    tickerMap[trade.ticker].unrealizedLosses += profit;
                }
            }
        });
        
        return Object.entries(tickerMap)
            .map(([ticker, data]) => ({
                ticker,
                realized: data.realized,
                unrealized: data.unrealizedGains + data.unrealizedLosses,
                total: data.realized + data.unrealizedGains + data.unrealizedLosses
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
                        <p className="text-slate-500">Realized: {formatCurrency(realized)}</p>
                        <p className={unrealized >= 0 ? "text-emerald-600" : "text-red-600"}>Unrealized: {formatCurrency(unrealized)}</p>
                        <p className="font-semibold text-slate-900 pt-1 border-t">Total: {formatCurrency(total)}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Label on the unrealized bar — placed just outside the end of the combined stack
    const CustomLabel = (props) => {
        const { x, y, width, height, index } = props;
        const entry = chartData[index];
        if (!entry || entry.unrealized === 0) return null;

        const pct = entry.realized !== 0
            ? (entry.unrealized / Math.abs(entry.realized)) * 100
            : 0;
        const formattedPct = `${pct >= 0 ? '+' : ''}${Math.round(pct)}%`;
        const color = entry.unrealized >= 0 ? '#10b981' : '#ef4444';

        // y is the top of this bar segment, height is its pixel height
        // For positive unrealized: label above (y - 5)
        // For negative unrealized: label below (y + height + 13)
        const labelY = entry.unrealized >= 0 ? y - 5 : y + Math.abs(height) + 13;

        return (
            <text x={x + width / 2} y={labelY} textAnchor="middle" fontSize={9} fill={color} fontWeight="700">
                {formattedPct}
            </text>
        );
    };

    if (chartData.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center text-slate-400">
                Add trades to see profit chart
            </div>
        );
    }

    return (
        <div className="h-[576px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 60 }}>
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
                    <Bar dataKey="realized" stackId="a" fill={realizedFill} radius={[0, 0, 0, 0]} opacity={selectedTicker ? (selectedTicker === chartData[0]?.ticker ? 1 : 0.3) : 1} onClick={(e) => onTickerSelect && onTickerSelect(e.ticker)} />
                    <Bar dataKey="unrealized" stackId="a" radius={[0, 0, 0, 0]} label={<CustomLabel />} onClick={(e) => onTickerSelect && onTickerSelect(e.ticker)}>
                        {chartData.map((entry, index) => {
                            const isSelected = selectedTicker === entry.ticker;
                            const opacity = selectedTicker ? (isSelected ? 1 : 0.3) : 1;
                            return (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.unrealized >= 0 ? '#10b981' : '#ef4444'}
                                    opacity={opacity}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}