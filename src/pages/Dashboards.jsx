import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardKPIs from '@/components/dashboard/DashboardKPIs';
import WeeklyTotalsChart from '@/components/dashboard/WeeklyTotalsChart';
import OpenPositionsChart from '@/components/dashboard/OpenPositionsChart';
import TimeComparisonsChart from '@/components/dashboard/TimeComparisonsChart';
import TickerHistoryChart from '@/components/dashboard/TickerHistoryChart';
import TickerTradesTable from '@/components/dashboard/TickerTradesTable';
import OpenPositionsTable from '@/components/dashboard/OpenPositionsTable';

export default function Dashboards() {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'weekly';
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedTicker, setSelectedTicker] = useState('all');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedChartTicker, setSelectedChartTicker] = useState(null);
    const tradeTypes = ['Trade', 'Covered Call', 'Cash Secured Put', 'Long Call', 'Long Put', 'Naked Put', 'Naked Call'];
    
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
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(trade.type);
            
            return yearMatch && tickerMatch && typeMatch;
        });
    }, [trades, selectedYear, selectedTicker, selectedTypes]);

    const dashboardMap = {
        weekly: { title: 'Weekly Totals', component: <WeeklyTotalsChart trades={filteredTrades} /> },
        ticker: { title: 'Ticker History', component: <><TickerHistoryChart trades={filteredTrades} onTickerSelect={setSelectedChartTicker} /><TickerTradesTable trades={filteredTrades} selectedTicker={selectedChartTicker} /></> },
        open: { title: 'Open Positions', component: <><OpenPositionsChart trades={filteredTrades} onTickerSelect={setSelectedChartTicker} /><OpenPositionsTable trades={filteredTrades} selectedTicker={selectedChartTicker} /></> },
        time: { title: 'Time Comparisons', component: <TimeComparisonsChart trades={filteredTrades} /> }
    };

    const dashboard = dashboardMap[view] || dashboardMap.weekly;

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">{dashboard.title}</h1>
                    <div className="flex gap-4 items-center">
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
                        <div className="hidden md:block w-40">
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

                <div className="hidden md:flex mb-6 flex-wrap gap-2">
                    {tradeTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedTypes(prev => 
                                prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                            )}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedTypes.includes(type)
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                
                {isLoading ? (
                    <div className="text-center text-slate-400 py-12">Loading...</div>
                ) : (
                    <>
                        {view !== 'time' && <DashboardKPIs trades={filteredTrades} view={view} />}
                        {dashboard.component}
                    </>
                )}
            </div>
        </div>
    );
}