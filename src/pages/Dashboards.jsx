import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WeeklyTotalsChart from '@/components/dashboard/WeeklyTotalsChart';
import OpenPositionsChart from '@/components/dashboard/OpenPositionsChart';
import TimeComparisonsChart from '@/components/dashboard/TimeComparisonsChart';
import TickerHistoryChart from '@/components/dashboard/TickerHistoryChart';

export default function Dashboards() {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'weekly';
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedTicker, setSelectedTicker] = useState('all');
    
    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
    });

    const years = useMemo(() => {
        const uniqueYears = new Set();
        trades.forEach(trade => {
            if (trade.income_week) {
                uniqueYears.add(new Date(trade.income_week).getFullYear());
            } else if (trade.open_date) {
                uniqueYears.add(new Date(trade.open_date).getFullYear());
            }
        });
        return Array.from(uniqueYears).sort((a, b) => b - a);
    }, [trades]);

    const tickers = useMemo(() => {
        const uniqueTickers = new Set();
        trades.forEach(trade => {
            if (trade.ticker) uniqueTickers.add(trade.ticker);
        });
        return Array.from(uniqueTickers).sort();
    }, [trades]);

    const filteredTrades = useMemo(() => {
        return trades.filter(trade => {
            const tradeYear = trade.income_week 
                ? new Date(trade.income_week).getFullYear() 
                : new Date(trade.open_date).getFullYear();
            
            const yearMatch = selectedYear === 'all' || tradeYear.toString() === selectedYear;
            const tickerMatch = selectedTicker === 'all' || trade.ticker === selectedTicker;
            
            return yearMatch && tickerMatch;
        });
    }, [trades, selectedYear, selectedTicker]);

    const dashboardMap = {
        weekly: { title: 'Weekly Totals', component: <WeeklyTotalsChart trades={filteredTrades} /> },
        ticker: { title: 'Ticker History', component: <TickerHistoryChart trades={filteredTrades} /> },
        open: { title: 'Open Positions', component: <OpenPositionsChart trades={filteredTrades} /> },
        time: { title: 'Time Comparisons', component: <TimeComparisonsChart trades={filteredTrades} /> }
    };

    const dashboard = dashboardMap[view] || dashboardMap.weekly;

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">{dashboard.title}</h1>
                    <div className="flex gap-4">
                        <div className="w-40">
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map(year => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-40">
                            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ticker" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tickers</SelectItem>
                                    {tickers.map(ticker => (
                                        <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="text-center text-slate-400 py-12">Loading...</div>
                ) : (
                    dashboard.component
                )}
            </div>
        </div>
    );
}