import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
            const entry = chartData.find(d => d.ticker === label);
            if (!entry) return null;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-slate-500">Realized: {formatCurrency(entry.realized)}</p>
                        <p className={entry.unrealized >= 0 ? "text-emerald-600" : "text-red-600"}>
                            Unrealized: {formatCurrency(entry.unrealized)}
                        </p>
                        <p className="font-semibold text-slate-900 pt-1 border-t">Total: {formatCurrency(entry.total)}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom shape for the realized bar — just grey
    const RealizedShape = (props) => {
        const { x, y, width, height } = props;
        if (height === 0) return null;
        return <rect x={x} y={y} width={width} height={Math.abs(height)} fill="#9ca3af" />;
    };

    // Custom shape for unrealized: always extends AWAY from zero (on top of realized if positive realized, below if negative realized)
    // Uses the yAxis scale to compute exact pixel positions
    const UnrealizedShape = (props) => {
        const { x, width, index, yAxis } = props;
        const entry = chartData[index];
        if (!entry || entry.unrealized === 0 || !yAxis?.scale) return null;

        const scale = yAxis.scale;
        const zeroY = scale(0);
        const realizedY = scale(entry.realized);
        const fill = entry.unrealized >= 0 ? '#10b981' : '#ef4444';

        // Start of unrealized bar: at the top/bottom of the realized bar (away from zero)
        const startY = realizedY; // top of positive realized bar, or bottom of negative
        // End of unrealized bar: realized + unrealized
        const endY = scale(entry.realized + entry.unrealized);

        const top = Math.min(startY, endY);
        const barHeight = Math.abs(endY - startY);

        if (barHeight < 1) return null;
        return <rect x={x} y={top} width={width} height={barHeight} fill={fill} />;
    };

    // Custom label for unrealized
    const UnrealizedLabel = (props) => {
        const { x, width, index, yAxis } = props;
        const entry = chartData[index];
        if (!entry || entry.unrealized === 0 || !yAxis?.scale) return null;

        const scale = yAxis.scale;
        const endY = scale(entry.realized + entry.unrealized);

        const base = Math.abs(entry.realized) || Math.abs(entry.unrealized);
        const pct = Math.round((entry.unrealized / base) * 100);
        const label = entry.unrealized >= 0 ? `+${pct}%` : `${pct}%`;
        const fill = entry.unrealized >= 0 ? '#10b981' : '#ef4444';
        // Place label above the bar top if going up, below bar bottom if going down
        const labelY = entry.unrealized >= 0 ? endY - 6 : endY + 12;

        return (
            <text x={x + width / 2} y={labelY} textAnchor="middle" fontSize={9} fill={fill} fontWeight="700">
                {label}
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
                    <Bar dataKey="realized" shape={<RealizedShape />} />
                    <Bar dataKey="unrealized" shape={<UnrealizedShape />} label={<UnrealizedLabel />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}