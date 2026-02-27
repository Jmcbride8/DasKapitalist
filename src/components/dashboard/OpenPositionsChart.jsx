import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

export default function OpenPositionsChart({ trades }) {
    const chartData = useMemo(() => {
        const openTrades = trades.filter(t => t.status === 'Open');
        
        if (openTrades.length === 0) {
            return [];
        }

        const dataByTicker = {};
        
        openTrades.forEach(trade => {
            if (!dataByTicker[trade.ticker]) {
                dataByTicker[trade.ticker] = {
                    ticker: trade.ticker,
                    open: 0,
                    unrealized: 0
                };
            }
            
            const collateralStart = trade.collateral_start || 0;
            const profit = trade.profit || 0;
            
            dataByTicker[trade.ticker].open += collateralStart;
            dataByTicker[trade.ticker].unrealized += profit;
        });

        return Object.values(dataByTicker).sort((a, b) => (b.open + b.unrealized) - (a.open + a.unrealized));
    }, [trades]);

    const formatCurrency = (value) => {
        if (value === 0) return '$0';
        const absValue = Math.abs(value);
        if (absValue >= 1000) {
            return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
        }
        return `${value < 0 ? '-' : ''}$${absValue.toFixed(0)}`;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                    <p className="text-sm font-medium text-slate-900">{data.ticker}</p>
                    <p className="text-sm text-slate-600">Open: {formatCurrency(data.open)}</p>
                    <p className="text-sm" style={{ color: data.unrealized >= 0 ? '#10b981' : '#ef4444' }}>
                        Unrealized: {formatCurrency(data.unrealized)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <Card className="border-0 shadow-none bg-white">
                <CardContent className="pt-6">
                    <div className="h-96 flex items-center justify-center text-slate-400">
                        No open positions
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-none bg-white">
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="ticker" stroke="#64748b" />
                        <YAxis 
                            tickFormatter={formatCurrency}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                        <Bar dataKey="open" stackId="a" fill="#9ca3af" name="Open" />
                        <Bar dataKey="unrealized" stackId="a" name="Unrealized" label={renderUnrealizedLabel}>
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.unrealized >= 0 ? '#10b981' : '#ef4444'} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}