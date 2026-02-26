import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProfitChart from '@/components/trades/ProfitChart';

export default function TickerHistoryChart({ trades }) {
    const [minImpact, setMinImpact] = useState(0);

    const filteredTrades = trades.filter(trade => {
        const profit = trade.profit || 0;
        return Math.abs(profit) >= minImpact;
    });

    return (
        <Card className="border-0 shadow-none bg-white">
            <CardContent className="pt-6">
                <div className="mb-4">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-400"></div>
                            <span className="text-sm text-slate-600">Realized</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-emerald-500"></div>
                            <span className="text-sm text-slate-600">Unrealized (Positive)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-sm text-slate-600">Unrealized (Negative)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">Min Impact:</label>
                        <Input
                            type="number"
                            value={minImpact}
                            onChange={(e) => setMinImpact(Math.max(0, parseFloat(e.target.value) || 0))}
                            placeholder="$0"
                            className="w-32"
                        />
                    </div>
                </div>
                <ProfitChart trades={filteredTrades} />
            </CardContent>
        </Card>
    );
}