import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { parseISO, startOfWeek, format } from 'date-fns';

export default function WeeklyTickerTreemap({ trades, selectedWeek }) {
    const treemapData = useMemo(() => {
        if (!selectedWeek) return [];

        const tickerProfit = {};
        trades.forEach(trade => {
            const tradeDate = trade.income_week || trade.close_date || trade.open_date;
            if (!tradeDate) return;

            try {
                if (tradeDate === selectedWeek && trade.profit != null) {
                    const ticker = trade.ticker || 'Unknown';
                    tickerProfit[ticker] = (tickerProfit[ticker] || 0) + trade.profit;
                }
            } catch {
                return;
            }
        });

        return Object.entries(tickerProfit)
            .map(([ticker, profit]) => ({
                name: ticker,
                value: Math.abs(profit),
                profit,
                fill: profit >= 0 ? '#10b981' : '#ef4444'
            }))
            .sort((a, b) => b.value - a.value);
    }, [trades, selectedWeek]);

    if (!selectedWeek || treemapData.length === 0) return null;

    return (
        <div className="space-y-2 pl-4 md:pl-8">
            <h3 className="text-sm font-semibold text-slate-700">Ticker Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
                <Treemap
                    data={treemapData}
                    dataKey="value"
                    aspectRatio={16/9}
                    stroke="#fff"
                    fillOpacity={0.8}
                >
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            padding: '0.5rem'
                        }}
                        formatter={(value) => [
                            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value),
                            'Profit'
                        ]}
                        labelFormatter={(name) => name}
                        cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                    />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
}