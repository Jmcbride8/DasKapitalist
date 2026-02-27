import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Table2 } from 'lucide-react';
import WeeklyProfitChart from '@/components/trades/WeeklyProfitChart';
import WeeklyTradesTable from '@/components/dashboard/WeeklyTradesTable';
import WeeklyTickerTreemap from '@/components/dashboard/WeeklyTickerTreemap';

export default function WeeklyTotalsChart({ trades }) {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [viewMode, setViewMode] = useState('treemap');

    return (
        <div className="space-y-2">
            <Card className="border-0 shadow-none bg-white">
                <CardContent className="pt-6">
                    <WeeklyProfitChart trades={trades} onWeekSelect={setSelectedWeek} />
                </CardContent>
            </Card>
            {selectedWeek && (
                <>
                    <Card className="border-0 shadow-none bg-white">
                        <CardContent className="pt-6">
                            <WeeklyTickerTreemap trades={trades} selectedWeek={selectedWeek} />
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-none bg-white">
                        <CardContent className="pt-6">
                            <h3 className="text-base font-semibold text-slate-800 mb-4">Week of {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                            <WeeklyTradesTable trades={trades} selectedWeek={selectedWeek} />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}