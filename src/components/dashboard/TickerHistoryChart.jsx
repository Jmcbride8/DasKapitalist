import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfitChart from '@/components/trades/ProfitChart';

export default function TickerHistoryChart({ trades }) {
    return (
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Ticker History</CardTitle>
                <p className="text-sm text-slate-500">Realized vs Unrealized profits by ticker</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                        <span className="text-sm text-slate-600">Realized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-slate-300"></div>
                        <span className="text-sm text-slate-600">Unrealized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500"></div>
                        <span className="text-sm text-slate-600">Loss</span>
                    </div>
                </div>
                <ProfitChart trades={trades} />
            </CardContent>
        </Card>
    );
}