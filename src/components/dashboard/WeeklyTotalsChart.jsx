import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Table2 } from 'lucide-react';
import WeeklyProfitChart from '@/components/trades/WeeklyProfitChart';
import WeeklyTradesTable from '@/components/dashboard/WeeklyTradesTable';
import WeeklyTickerTreemap from '@/components/dashboard/WeeklyTickerTreemap';

export default function WeeklyTotalsChart({ trades }) {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [viewMode, setViewMode] = useState('treemap');
    const [periodMode, setPeriodMode] = useState('weekly');

    return (
        <div className="space-y-2">
            <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-700 mb-4">
                <button
                    onClick={() => setPeriodMode('weekly')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        periodMode === 'weekly'
                            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setPeriodMode('monthly')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        periodMode === 'monthly'
                            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    Monthly
                </button>
            </div>
            <Card className="border-0 shadow-none bg-transparent ml-[-2rem] md:ml-[-4rem]">
                <CardContent className="pt-6 px-4 md:px-8">
                    <WeeklyProfitChart trades={trades} onWeekSelect={setSelectedWeek} periodMode={periodMode} />
                </CardContent>
            </Card>
            {selectedWeek && (
                <>
                    <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-700">
                        <button
                            onClick={() => setViewMode('treemap')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                                viewMode === 'treemap'
                                    ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Treemap
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                                viewMode === 'table'
                                    ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <Table2 className="w-4 h-4" />
                            Table
                        </button>
                    </div>
                    {viewMode === 'treemap' && (
                        <Card className="border-0 shadow-none bg-transparent ml-[-2rem] md:ml-[-4rem]">
                            <CardContent className="pt-6 px-4 md:px-8">
                                <WeeklyTickerTreemap trades={trades} selectedWeek={selectedWeek} />
                            </CardContent>
                        </Card>
                    )}
                    {viewMode === 'table' && (
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardContent className="pt-6">
                                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Week of {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                                <WeeklyTradesTable trades={trades} selectedWeek={selectedWeek} />
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}