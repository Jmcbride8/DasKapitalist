import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklyTotalsChart from '@/components/dashboard/WeeklyTotalsChart';
import OpenPositionsChart from '@/components/dashboard/OpenPositionsChart';
import TimeComparisonsChart from '@/components/dashboard/TimeComparisonsChart';
import TickerHistoryChart from '@/components/dashboard/TickerHistoryChart';

export default function Dashboards() {
    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboards</h1>
                
                {isLoading ? (
                    <div className="text-center text-slate-400 py-12">Loading...</div>
                ) : (
                    <Tabs defaultValue="open" className="w-full h-full flex flex-col">
                        <TabsList className="mb-6">
                            <TabsTrigger value="open">Open Positions</TabsTrigger>
                            <TabsTrigger value="ticker">Ticker History</TabsTrigger>
                            <TabsTrigger value="weekly">Weekly Totals</TabsTrigger>
                            <TabsTrigger value="time">Time Comparisons</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="open" className="flex-1">
                            <OpenPositionsChart trades={trades} />
                        </TabsContent>
                        
                        <TabsContent value="ticker" className="flex-1">
                            <TickerHistoryChart trades={trades} />
                        </TabsContent>
                        
                        <TabsContent value="weekly" className="flex-1">
                            <WeeklyTotalsChart trades={trades} />
                        </TabsContent>
                        
                        <TabsContent value="time" className="flex-1">
                            <TimeComparisonsChart trades={trades} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}