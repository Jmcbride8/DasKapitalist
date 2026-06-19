import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardKPIs from '@/components/dashboard/DashboardKPIs';
import WeeklyTotalsChart from '@/components/dashboard/WeeklyTotalsChart';
import OpenPositionsChart from '@/components/dashboard/OpenPositionsChart';
import TimeComparisonsChart from '@/components/dashboard/TimeComparisonsChart';
import TickerHistoryChart from '@/components/dashboard/TickerHistoryChart';
import TickerTradesTable from '@/components/dashboard/TickerTradesTable';
import OpenPositionsTable from '@/components/dashboard/OpenPositionsTable';

export default function Dashboards() {
    const { user, isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'weekly';
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedTicker, setSelectedTicker] = useState('all');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedChartTicker, setSelectedChartTicker] = useState(null);
    const tradeTypes = ['Trade', 'Covered Call', 'Cash Secured Put', 'Long Call', 'Long Put', 'Naked Put', 'Naked Call'];
    
    // Demo mode: show your actual trades when not authenticated
    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades', user?.id, isAuthenticated],
        queryFn: () => {
            if (isAuthenticated) {
                return base44.entities.Trade.filter({ created_by_id: user?.id }, '-open_date');
            } else {
                // Demo mode: fetch your actual trades (by your user ID)
                return base44.entities.Trade.filter({ created_by_id: '694b97feaa431cbfcfc8fd45' }, '-open_date', 50);
            }
        },
        enabled: true // Always enabled for demo
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
        weekly: { title: 'Streaks', desc: 'Discipline lives in the data. Track your streaks — winning and losing — so you stay grounded, not greedy. Know when to press your edge, and know when the market is telling you to step back, breathe, and reassess.', component: <WeeklyTotalsChart trades={filteredTrades} /> },
        ticker: { title: 'Edge', desc: 'Every ticker tells a story. Identify where you have a genuine edge and let your winners run — but be honest about where the data says cut your losses and move on. Conviction without evidence is just hope.', component: <><TickerHistoryChart trades={filteredTrades} onTickerSelect={setSelectedChartTicker} /><TickerTradesTable trades={filteredTrades} selectedTicker={selectedChartTicker} /></> },
        open: { title: 'Exposure', desc: 'This is what\'s at play right now. Capital deployed, collateral tied up, risk on the table. Getting overextended is easy — a run of wins builds confidence, confidence kills discipline, and suddenly you\'re exposed. Know your number before the market reminds you.', component: <><OpenPositionsChart trades={filteredTrades} onTickerSelect={setSelectedChartTicker} /><OpenPositionsTable trades={filteredTrades} selectedTicker={selectedChartTicker} /></> },
        time: { title: 'Track Record', desc: 'Track record tells the truth. See how your P&L compounds over time, and which tickers are carrying the week.', component: <TimeComparisonsChart trades={filteredTrades} /> }
    };

    const dashboard = dashboardMap[view] || dashboardMap.weekly;

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">{dashboard.title}</h1>
                        <div className="flex gap-3 items-center">
                            <div className="w-36">
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
                            <div className="hidden md:block w-36">
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
                    <p className="text-sm text-slate-500 italic mt-3">{dashboard.desc}</p>
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