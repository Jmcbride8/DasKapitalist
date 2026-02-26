import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProfitChart from '@/components/trades/ProfitChart';

export default function TickerHistoryChart({ trades }) {
    return (
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
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
                <ProfitChart trades={trades} />
            </CardContent>
        </Card>
    );
}