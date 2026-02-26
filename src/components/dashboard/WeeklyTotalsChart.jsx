import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyProfitChart from '@/components/trades/WeeklyProfitChart';

export default function WeeklyTotalsChart({ trades }) {
    return (
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Weekly Totals</CardTitle>
                <p className="text-sm text-slate-500">Income grouped by week</p>
            </CardHeader>
            <CardContent>
                <WeeklyProfitChart trades={trades} />
            </CardContent>
        </Card>
    );
}