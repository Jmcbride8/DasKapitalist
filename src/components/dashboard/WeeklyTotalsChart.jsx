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
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('treemap')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                viewMode === 'treemap'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Treemap
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                viewMode === 'table'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Table2 className="w-4 h-4" />
                            Table
                        </button>
                    </div>
                    {viewMode === 'treemap' && (
                        <Card className="border-0 shadow-none bg-white">
                            <CardContent className="pt-6">
                                <WeeklyTickerTreemap trades={trades} selectedWeek={selectedWeek} />
                            </CardContent>
                        </Card>
                    )}
                    {viewMode === 'table' && (
                        <Card className="border-0 shadow-none bg-white">
                            <CardContent className="pt-6">
                                <h3 className="text-base font-semibold text-slate-800 mb-4">Week of {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                                <WeeklyTradesTable trades={trades} selectedWeek={selectedWeek} />
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}