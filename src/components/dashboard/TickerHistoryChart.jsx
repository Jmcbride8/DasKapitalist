import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProfitChart from '@/components/trades/ProfitChart';

export default function TickerHistoryChart({ trades }) {
    const [minImpact, setMinImpact] = useState(1000);

    const filteredTrades = trades.filter(trade => {
        const profit = trade.profit || 0;
        return Math.abs(profit) >= minImpact;
    });

    return (
        <Card className="border-0 shadow-none bg-white">
            <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-4">
                    <label className="text-sm text-slate-600">Min Impact:</label>
                    <Input
                        type="number"
                        value={minImpact}
                        onChange={(e) => setMinImpact(Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder="$1000"
                        className="w-32"
                    />
                </div>
                <ProfitChart trades={filteredTrades} />
            </CardContent>
        </Card>
    );
}