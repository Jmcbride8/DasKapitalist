import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ProfitChart from '@/components/trades/ProfitChart';

export default function TickerHistoryChart({ trades }) {
    const [minImpact, setMinImpact] = useState(1000);
    const [inputDisplay, setInputDisplay] = useState('1,000');

    const filteredTrades = trades.filter(trade => {
        const profit = trade.profit || 0;
        return Math.abs(profit) >= minImpact;
    });

    const handleInputChange = (e) => {
        const raw = e.target.value.replace(/,/g, '');
        const num = parseFloat(raw) || 0;
        setMinImpact(Math.max(0, num));
        setInputDisplay(num > 0 ? num.toLocaleString('en-US') : '');
    };

    const handleBlur = () => {
        setInputDisplay(minImpact > 0 ? minImpact.toLocaleString('en-US') : '0');
    };

    // Calculate total unrealized vs realized for donut
    const { totalRealized, totalUnrealized, pct } = useMemo(() => {
        let realized = 0;
        let unrealized = 0;
        filteredTrades.forEach(t => {
            const p = t.profit || 0;
            if (t.status === 'Closed') realized += p;
            else unrealized += p;
        });
        const totalAbs = Math.abs(realized) + Math.abs(unrealized);
        const percentage = realized !== 0 ? Math.round((unrealized / Math.abs(realized)) * 100) : 0;
        return { totalRealized: realized, totalUnrealized: unrealized, pct: percentage };
    }, [filteredTrades]);

    const donutData = [
        { value: Math.abs(totalRealized) },
        { value: Math.abs(totalUnrealized) }
    ];
    const donutColors = ['#9ca3af', totalUnrealized >= 0 ? '#10b981' : '#ef4444'];
    const pctColor = pct >= 0 ? 'text-emerald-600' : 'text-red-500';

    return (
        <Card className="border-0 shadow-none bg-white">
            <CardContent className="pt-6">
                <div className="relative">
                    {/* Min Impact input */}
                    <div className="mb-4 flex items-center gap-2">
                        <label className="text-sm text-slate-500">Min Impact:</label>
                        <div className="flex items-center border-b border-slate-400 focus-within:border-slate-700 transition-colors">
                            <span className="text-slate-500 text-sm pr-0.5">$</span>
                            <input
                                type="text"
                                value={inputDisplay}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="w-24 text-sm bg-transparent outline-none py-0.5 text-slate-700 text-center"
                            />
                        </div>
                    </div>

                    {/* Donut chart overlay - top right */}
                    <div className="absolute top-0 right-0 flex flex-col items-center" style={{ width: 110 }}>
                        <div className="relative" style={{ width: 100, height: 100 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={46}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        strokeWidth={0}
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell key={index} fill={donutColors[index]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-sm font-bold ${pctColor}`} style={{ fontSize: 18 }}>
                                    {pct >= 0 ? '+' : ''}{pct}%
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center leading-tight mt-1">
                            Unrealized<br />vs Realized
                        </p>
                    </div>

                    <ProfitChart trades={filteredTrades} />
                </div>
            </CardContent>
        </Card>
    );
}