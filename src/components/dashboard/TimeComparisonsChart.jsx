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
            const d = parseISO(dateStr);
            if (isNaN(d.getTime())) return;
            const key = format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            byWeek[key] = (byWeek[key] || 0) + (t.profit || 0);
        });
        const sorted = Object.entries(byWeek).sort(([a], [b]) => a.localeCompare(b));
        let cumulative = 0;
        return sorted.map(([week, profit]) => {
            cumulative += profit;
            return { week: format(parseISO(week), 'MMM dd'), profit, cumulative, date: week };
        });
    }, [closedTrades]);

    // ── Monthly breakdown ────────────────────────────────────────────────────
    const monthlyData = useMemo(() => {
        const byMonth = {};
        closedTrades.forEach(t => {
            const dateStr = t.income_week || t.close_date || t.open_date;
            if (!dateStr) return;
            const key = format(parseISO(dateStr), 'yyyy-MM');
            if (!byMonth[key]) byMonth[key] = { profit: 0, trades: 0, wins: 0 };
            byMonth[key].profit += t.profit || 0;
            byMonth[key].trades += 1;
            if ((t.profit || 0) > 0) byMonth[key].wins += 1;
        });
        return Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, d]) => ({
                month: format(parseISO(month + '-01'), 'MMM yy'),
                profit: d.profit,
                winRate: d.trades > 0 ? (d.wins / d.trades) * 100 : 0,
                trades: d.trades,
                rawMonth: month,
            }));
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
        { id: 'cumulative', label: 'Equity Curve' },
        { id: 'monthly', label: 'Monthly P&L' },
        { id: 'yoy', label: 'Year-over-Year' },
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Pill label="Total P&L" value={fmtFull(kpis.totalProfit)} sub={`${kpis.totalTrades} closed trades`} color={kpis.totalProfit >= 0 ? 'emerald' : 'rose'} icon={TrendingUp} />
                <Pill label="Win Rate" value={`${kpis.winRate.toFixed(0)}%`} sub="of closed trades profitable" color="blue" icon={Target} />
                <Pill label="Avg Win" value={fmtFull(kpis.avgWin)} sub="per winning trade" color="emerald" icon={Zap} />
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

            {/* ── Equity Curve ── */}
            {activeTab === 'cumulative' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Portfolio Equity Curve</h3>
                    <p className="text-xs text-slate-400 mb-4">Cumulative realized P&L over time, with weekly net profit bars</p>
                    <ResponsiveContainer width="100%" height={340}>
                        <AreaChart data={cumulativeData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <ReferenceLine y={0} stroke="#e2e8f0" />
                            <Bar dataKey="profit" name="Weekly P&L" fill="#10b981" radius={[2, 2, 0, 0]} opacity={0.5}>
                                {cumulativeData.map((entry, i) => (
                                    <Cell key={i} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                                ))}
                            </Bar>
                            <Area type="monotone" dataKey="cumulative" name="Cumulative P&L" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ── Monthly P&L ── */}
            {activeTab === 'monthly' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Monthly Net P&L</h3>
                        <p className="text-xs text-slate-400 mb-4">Green = profitable month, Red = loss month</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <Tooltip content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                            <p className="font-bold text-slate-700 mb-1">{label}</p>
                                            <p>P&L: <span className={`font-bold ${d.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(d.profit)}</span></p>
                                            <p className="text-slate-500">Win Rate: {d.winRate.toFixed(0)}%</p>
                                            <p className="text-slate-500">Trades: {d.trades}</p>
                                        </div>
                                    );
                                }} />
                                <ReferenceLine y={0} stroke="#cbd5e1" />
                                <Bar dataKey="profit" name="Monthly P&L" radius={[4, 4, 0, 0]}>
                                    {monthlyData.map((entry, i) => (
                                        <Cell key={i} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Win Rate line */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Monthly Win Rate %</h3>
                        <p className="text-xs text-slate-400 mb-4">What % of trades in each month closed profitably</p>
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <Tooltip formatter={(v) => [`${v.toFixed(0)}%`, 'Win Rate']} />
                                <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="4 4" label={{ value: '50%', fontSize: 10, fill: '#94a3b8' }} />
                                <Line type="monotone" dataKey="winRate" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── Year-over-Year ── */}
            {activeTab === 'yoy' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Year-over-Year Monthly Comparison</h3>
                    <p className="text-xs text-slate-400 mb-4">Compare the same calendar months across different years</p>
                    {yoyYears.length < 2 ? (
                        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                            Need at least 2 years of data for year-over-year comparison.
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-4 mb-4">
                                {yoyYears.map((y, i) => (
                                    <div key={y} className="flex items-center gap-1.5 text-xs">
                                        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: YEAR_COLORS[i % YEAR_COLORS.length] }} />
                                        <span className="text-slate-600 font-medium">{y}</span>
                                    </div>
                                ))}
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={yoyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} barCategoryGap="20%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                    <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <ReferenceLine y={0} stroke="#e2e8f0" />
                                    {yoyYears.map((y, i) => (
                                        <Bar key={y} dataKey={y} name={String(y)} fill={YEAR_COLORS[i % YEAR_COLORS.length]} radius={[3, 3, 0, 0]} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>

                            {/* YoY summary table */}
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-2 text-slate-400 font-medium">Year</th>
                                            <th className="text-right py-2 text-slate-400 font-medium">Total P&L</th>
                                            <th className="text-right py-2 text-slate-400 font-medium">Best Month</th>
                                            <th className="text-right py-2 text-slate-400 font-medium">Worst Month</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {yoyYears.map((y, i) => {
                                            const vals = yoyData.map(row => row[y] || 0);
                                            const total = vals.reduce((s, v) => s + v, 0);
                                            const best = Math.max(...vals);
                                            const worst = Math.min(...vals);
                                            return (
                                                <tr key={y} className="border-b border-slate-50">
                                                    <td className="py-2 font-semibold" style={{ color: YEAR_COLORS[i % YEAR_COLORS.length] }}>{y}</td>
                                                    <td className={`py-2 text-right font-bold ${total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(total)}</td>
                                                    <td className="py-2 text-right text-emerald-600 font-medium">{fmtFull(best)}</td>
                                                    <td className="py-2 text-right text-rose-600 font-medium">{fmtFull(worst)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Ticker Matrix ── */}
            {activeTab === 'tickers' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Ticker Performance Matrix</h3>
                        <p className="text-xs text-slate-400 mb-4">Total realized P&L ranked by ticker</p>
                        <ResponsiveContainer width="100%" height={Math.max(200, tickerMatrix.length * 38)}>
                            <BarChart data={tickerMatrix} layout="vertical" margin={{ top: 0, right: 80, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="ticker" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} tickLine={false} axisLine={false} width={50} />
                                <Tooltip content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                            <p className="font-bold text-slate-700 mb-1">{d.ticker}</p>
                                            <p>Total P&L: <span className={`font-bold ${d.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(d.profit)}</span></p>
                                            <p className="text-slate-500">Trades: {d.trades}</p>
                                            <p className="text-slate-500">Win Rate: {d.winRate.toFixed(0)}%</p>
                                            <p className="text-slate-500">Avg/Trade: {fmtFull(d.avgProfit)}</p>
                                        </div>
                                    );
                                }} />
                                <ReferenceLine x={0} stroke="#cbd5e1" />
                                <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                                    {tickerMatrix.map((entry, i) => (
                                        <Cell key={i} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats table */}
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