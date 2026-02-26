import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklyTotalsChart from '@/components/dashboard/WeeklyTotalsChart';
import OpenPositionsChart from '@/components/dashboard/OpenPositionsChart';
import TimeComparisonsChart from '@/components/dashboard/TimeComparisonsChart';
import TickerHistoryChart from '@/components/dashboard/TickerHistoryChart';

export default function Dashboards() {
    const [view, setView] = useState('weekly');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setView(urlParams.get('view') || 'weekly');
    }, [window.location.search]);
    
    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
    });

    const dashboardMap = {
        weekly: { title: 'Weekly Totals', component: <WeeklyTotalsChart trades={trades} /> },
        ticker: { title: 'Ticker History', component: <TickerHistoryChart trades={trades} /> },
        open: { title: 'Open Positions', component: <OpenPositionsChart trades={trades} /> },
        time: { title: 'Time Comparisons', component: <TimeComparisonsChart trades={trades} /> }
    };

    const dashboard = dashboardMap[view] || dashboardMap.weekly;

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{dashboard.title}</h1>
                
                {isLoading ? (
                    <div className="text-center text-slate-400 py-12">Loading...</div>
                ) : (
                    dashboard.component
                )}
            </div>
        </div>
    );
}