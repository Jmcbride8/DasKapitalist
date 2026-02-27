import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { format, startOfMonth, getWeek, getYear, parseISO, subMonths, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown, Zap, Target, Award, Activity, RefreshCw } from 'lucide-react';

const fmt = (v) => {
    if (v === null || v === undefined || isNaN(v)) return '$0';
    const abs = Math.abs(v);
    if (abs >= 1000) return `${v < 0 ? '-' : ''}$${(abs / 1000).toFixed(1)}k`;
    return `${v < 0 ? '-' : ''}$${abs.toFixed(0)}`;
};

const fmtFull = (v) => {
    if (!v && v !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
};

const pct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

// ── Metric pill ──────────────────────────────────────────────────────────────
const Pill = ({ label, value, sub, color = 'emerald', icon: Icon }) => {
    const colors = {
        emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-700',
        blue: 'from-blue-50 to-blue-100/50 border-blue-200 text-blue-700',
        amber: 'from-amber-50 to-amber-100/50 border-amber-200 text-amber-700',
        rose: 'from-rose-50 to-rose-100/50 border-rose-200 text-rose-700',
        violet: 'from-violet-50 to-violet-100/50 border-violet-200 text-violet-700',
    };
    return (
        <div className={`rounded-xl border bg-gradient-to-br p-4 flex flex-col gap-1 ${colors[color]}`}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
                {Icon && <Icon className="w-4 h-4 opacity-60" />}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <div className="text-xs opacity-60">{sub}</div>}
        </div>
    );
};

// ── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = '$' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
            <p className="font-semibold text-slate-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-500">{p.name}:</span>
                    <span className="font-bold" style={{ color: p.value >= 0 ? '#059669' : '#e11d48' }}>
                        {fmtFull(p.value)}
                    </span>
                </div>
            ))}
        </div>
    );
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function TimeComparisonsChart({ trades }) {
    const [activeTab, setActiveTab] = useState('cumulative');
    const [liveData, setLiveData] = useState(null);
    const [liveLoading, setLiveLoading] = useState(false);
    const [liveError, setLiveError] = useState(null);

    const closedTrades = useMemo(() => trades.filter(t => t.status === 'Closed' && t.profit != null), [trades]);
    const allTrades = useMemo(() => trades.filter(t => t.profit != null || t.open_premium != null), [trades]);

    // ── Cumulative P&L by week ───────────────────────────────────────────────
    const cumulativeData = useMemo(() => {
        const byWeek = {};
        closedTrades.forEach(t => {
            const dateStr = t.income_week || t.close_date || t.open_date;
            if (!dateStr) return;
            try {
                const d = parseISO(dateStr);
                if (isNaN(d.getTime())) return;
                const key = format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                byWeek[key] = (byWeek[key] || 0) + (t.profit || 0);
            } catch {
                return;
            }
        });
        const sorted = Object.entries(byWeek).sort(([a], [b]) => a.localeCompare(b));
        let cumulative = 0;
        return sorted.map(([week, profit]) => {
            try {
                cumulative += profit;
                return { week: format(parseISO(week), 'MMM dd'), profit, cumulative, date: week };
            } catch {
                return null;
            }
        }).filter(Boolean);
    }, [closedTrades]);

    // ── Monthly breakdown ────────────────────────────────────────────────────
    const monthlyData = useMemo(() => {
        const byMonth = {};
        closedTrades.forEach(t => {
            const dateStr = t.income_week || t.close_date || t.open_date;
            if (!dateStr) return;
            try {
                const d = parseISO(dateStr);
                if (isNaN(d.getTime())) return;
                const key = format(d, 'yyyy-MM');
                if (!byMonth[key]) byMonth[key] = { profit: 0, trades: 0, wins: 0 };
                byMonth[key].profit += t.profit || 0;
                byMonth[key].trades += 1;
                if ((t.profit || 0) > 0) byMonth[key].wins += 1;
            } catch {
                return;
            }
        });
        return Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, d]) => {
                try {
                    const monthDate = new Date(month + '-01T00:00:00Z');
                    if (isNaN(monthDate.getTime())) return null;
                    return {
                        month: format(monthDate, 'MMM yy'),
                        profit: d.profit,
                        winRate: d.trades > 0 ? (d.wins / d.trades) * 100 : 0,
                        trades: d.trades,
                        rawMonth: month,
                    };
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
    }, [closedTrades]);

    // ── Year-over-year comparison ────────────────────────────────────────────
    const yoyData = useMemo(() => {
        const byYearMonth = {};
        closedTrades.forEach(t => {
            const dateStr = t.income_week || t.close_date || t.open_date;
            if (!dateStr) return;
            const d = parseISO(dateStr);
            if (isNaN(d.getTime())) return;
            const year = getYear(d);
            const monthIdx = d.getMonth();
            const key = `${year}-${monthIdx}`;
            byYearMonth[key] = (byYearMonth[key] || 0) + (t.profit || 0);
        });
        const years = [...new Set(closedTrades.map(t => {
            const ds = t.income_week || t.close_date || t.open_date;
            return ds ? getYear(parseISO(ds)) : null;
        }).filter(Boolean))].sort();

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames.map((name, idx) => {
            const row = { month: name };
            years.forEach(y => { row[y] = byYearMonth[`${y}-${idx}`] || 0; });
            return row;
        });
    }, [closedTrades]);

    const yoyYears = useMemo(() => {
        return [...new Set(closedTrades.map(t => {
            const ds = t.income_week || t.close_date || t.open_date;
            if (!ds) return null;
            const d = parseISO(ds);
            return isNaN(d.getTime()) ? null : getYear(d);
        }).filter(Boolean))].sort();
    }, [closedTrades]);

    const YEAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#e11d48', '#8b5cf6'];

    // ── Ticker performance matrix ─────────────────────────────────────────────
    const tickerMatrix = useMemo(() => {
        const byTicker = {};
        closedTrades.forEach(t => {
            if (!t.ticker) return;
            if (!byTicker[t.ticker]) byTicker[t.ticker] = { profit: 0, trades: 0, wins: 0, premiums: 0 };
            byTicker[t.ticker].profit += t.profit || 0;
            byTicker[t.ticker].trades += 1;
            byTicker[t.ticker].premiums += t.open_premium || 0;
            if ((t.profit || 0) > 0) byTicker[t.ticker].wins += 1;
        });
        return Object.entries(byTicker)
            .map(([ticker, d]) => ({
                ticker,
                profit: d.profit,
                trades: d.trades,
                winRate: d.trades > 0 ? (d.wins / d.trades) * 100 : 0,
                avgProfit: d.trades > 0 ? d.profit / d.trades : 0,
            }))
            .sort((a, b) => b.profit - a.profit);
    }, [closedTrades]);

    // ── Summary KPIs ─────────────────────────────────────────────────────────
    const kpis = useMemo(() => {
        const totalProfit = closedTrades.reduce((s, t) => s + (t.profit || 0), 0);
        const wins = closedTrades.filter(t => (t.profit || 0) > 0);
        const losses = closedTrades.filter(t => (t.profit || 0) < 0);
        const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
        const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.profit, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.profit, 0) / losses.length : 0;
        const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : null;

        // streak
        const sorted = [...closedTrades].sort((a, b) => {
            const da = a.income_week || a.close_date || a.open_date || '';
            const db = b.income_week || b.close_date || b.open_date || '';
            return da.localeCompare(db);
        });
        let maxStreak = 0, streak = 0;
        sorted.forEach(t => {
            if ((t.profit || 0) > 0) { streak++; maxStreak = Math.max(maxStreak, streak); }
            else streak = 0;
        });

        return { totalProfit, winRate, avgWin, avgLoss, profitFactor, maxStreak, totalTrades: closedTrades.length };
    }, [closedTrades]);

    // ── Live market data ──────────────────────────────────────────────────────
    const topTickers = useMemo(() => tickerMatrix.slice(0, 5).map(t => t.ticker), [tickerMatrix]);

    const fetchLiveData = async () => {
        if (!topTickers.length) return;
        setLiveLoading(true);
        setLiveError(null);
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Get the current stock price and today's percentage change for these tickers: ${topTickers.join(', ')}. 
                Also provide a one-sentence market sentiment summary.
                Return JSON with:
                {
                  "stocks": [{ "ticker": "AAPL", "price": 185.23, "change_pct": 0.5, "change_dollar": 0.92 }],
                  "sentiment": "Market is showing cautious optimism..."
                }`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: 'object',
                    properties: {
                        stocks: { type: 'array', items: { type: 'object', properties: { ticker: { type: 'string' }, price: { type: 'number' }, change_pct: { type: 'number' }, change_dollar: { type: 'number' } } } },
                        sentiment: { type: 'string' }
                    }
                }
            });
            setLiveData(result);
        } catch (e) {
            setLiveError('Could not fetch live data');
        }
        setLiveLoading(false);
    };

    const tabs = [
        { id: 'tickers', label: 'Ticker Matrix' },
    ];

    if (!closedTrades.length) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                No closed trades with profit data available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
             {/* KPI Strip */}
             <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                 <Pill label="Profit Factor" value={kpis.profitFactor ? kpis.profitFactor.toFixed(2) + 'x' : 'N/A'} sub="win/loss ratio" color="violet" icon={Activity} />
                 <Pill label="Best Streak" value={`${kpis.maxStreak} wins`} sub="consecutive profitable trades" color="amber" icon={Award} />
             </div>

            {/* Live Market Panel */}
            {topTickers.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-semibold text-slate-200">Live Market — Your Top Holdings</span>
                        </div>
                        <button
                            onClick={fetchLiveData}
                            disabled={liveLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs font-medium"
                        >
                            <RefreshCw className={`w-3 h-3 ${liveLoading ? 'animate-spin' : ''}`} />
                            {liveLoading ? 'Fetching...' : 'Fetch Prices'}
                        </button>
                    </div>
                    {liveError && <p className="text-rose-400 text-xs">{liveError}</p>}
                    {!liveData && !liveLoading && (
                        <p className="text-slate-400 text-xs">Click "Fetch Prices" to load live quotes for your most-traded tickers.</p>
                    )}
                    {liveData && (
                        <>
                            <div className="flex flex-wrap gap-3 mb-2">
                                {liveData.stocks?.map(s => (
                                    <div key={s.ticker} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                                        <span className="font-bold text-sm">{s.ticker}</span>
                                        <span className="text-slate-300 text-sm">${s.price?.toFixed(2)}</span>
                                        <span className={`text-xs font-semibold ${s.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {s.change_pct >= 0 ? '▲' : '▼'} {Math.abs(s.change_pct).toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {liveData.sentiment && (
                                <p className="text-slate-400 text-xs italic">"{liveData.sentiment}"</p>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>



            {/* ── Ticker Matrix ── */}
            {activeTab === 'tickers' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                {['Ticker', 'Total P&L', 'Trades', 'Win Rate', 'Avg/Trade', 'Efficiency'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tickerMatrix.map((row, i) => {
                                    const maxProfit = Math.max(...tickerMatrix.map(r => Math.abs(r.profit)));
                                    const efficiency = maxProfit > 0 ? (row.profit / maxProfit) * 100 : 0;
                                    return (
                                        <tr key={row.ticker} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-slate-800">{row.ticker}</td>
                                            <td className={`px-4 py-3 font-bold ${row.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(row.profit)}</td>
                                            <td className="px-4 py-3 text-slate-500">{row.trades}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full bg-indigo-400" style={{ width: `${row.winRate}%` }} />
                                                    </div>
                                                    <span className="text-slate-600">{row.winRate.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 font-medium ${row.avgProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(row.avgProfit)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${efficiency >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                                            style={{ width: `${Math.abs(efficiency)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}