import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WeeklyProfitChart from '@/components/trades/WeeklyProfitChart';

export default function WeeklyTotalsChart({ trades }) {
    return (
        <Card className="border-0 shadow-none bg-white">
            <CardContent className="pt-6">
                <WeeklyProfitChart trades={trades} />
            </CardContent>
        </Card>
    );
}