import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
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
            const collateralGain = trade.collateral_gain || 0;
            
            dataByTicker[trade.ticker].open += collateralStart;
            dataByTicker[trade.ticker].unrealized += collateralGain;
        });

        return Object.values(dataByTicker).sort((a, b) => (b.open + b.unrealized) - (a.open + a.unrealized));
    }, [trades]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                    <p className="text-sm font-medium text-slate-900">{data.ticker}</p>
                    <p className="text-sm text-slate-600">Open: ${data.open.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                    {payload.map((entry, idx) => (
                        entry.name === 'Unrealized' && (
                            <p key={idx} className="text-sm" style={{ color: entry.color }}>
                                Unrealized: ${entry.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </p>
                        )
                    ))}
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
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="ticker" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                        <Bar dataKey="open" fill="#64748b" name="Open" />
                        <Bar dataKey="unrealized" fill="#10b981" name="Unrealized" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}