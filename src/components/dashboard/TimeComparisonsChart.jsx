import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import { format, parseISO, parse, startOfWeek, isValid } from 'date-fns';
import { TrendingUp, Award, Activity, Target, Zap } from 'lucide-react';

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Try ISO format first
    let d = parseISO(dateStr);
    if (isValid(d)) return d;
    // Try M/d/yy format
    d = parse(dateStr, 'M/d/yy', new Date());
    if (isValid(d)) return d;
    // Try M/d/yyyy format
    d = parse(dateStr, 'M/d/yyyy', new Date());
    if (isValid(d)) return d;
    return null;
};

const fmtFull = (v) => {
    if (!v && v !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
};

const fmt = (v) => {
    if (v === null || v === undefined || isNaN(v)) return '$0';
    const abs = Math.abs(v);
    if (abs >= 1000) return `${v < 0 ? '-' : ''}$${(abs / 1000).toFixed(1)}k`;
    return `${v < 0 ? '-' : ''}$${abs.toFixed(0)}`;
};

const Pill = ({ label, value, sub, color = 'emerald', icon: Icon }) => {
    const colors = {
        emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-700',
        blue: 'from-blue-50 to-blue-100/50 border-blue-200 text-blue-700',
        amber: 'from-amber-50 to-amber-100/50 border-amber-200 text-amber-700',
        rose: 'from-rose-50 to-rose-100/50 border-rose-200 text-rose-700',
        violet: 'from-violet-50 to-violet-100/50 border-violet-200 text-violet-700',
        slate: 'from-slate-50 to-slate-100/50 border-slate-200 text-slate-700',
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

const ChartTooltip = ({ active, payload, label }) => {
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

export default function TimeComparisonsChart({ trades }) {
    const [activeTab, setActiveTab] = useState('tickers');
    const [periodMode, setPeriodMode] = useState('weekly');


    const closedTrades = useMemo(() => trades.filter(t => t.status === 'Closed' && t.profit != null), [trades]);
    const openTrades = useMemo(() => trades.filter(t => t.status === 'Open' && t.profit != null), [trades]);

    // ── Cumulative P&L by week or month ───────────────────────────────────────
    const cumulativeData = useMemo(() => {
        const byPeriod = {};

        const getKey = (dateStr) => {
            const d = parseDate(dateStr);
            if (!d) return null;
            return periodMode === 'weekly'
                ? format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
                : format(d, 'yyyy-MM');
        };

        closedTrades.forEach(t => {
            const key = getKey(t.income_week || t.close_date || t.open_date);
            if (!key) return;
            if (!byPeriod[key]) byPeriod[key] = { closed: 0, open: 0 };
            byPeriod[key].closed += t.profit || 0;
        });

        openTrades.forEach(t => {
            const key = getKey(t.income_week || t.open_date);
            if (!key) return;
            if (!byPeriod[key]) byPeriod[key] = { closed: 0, open: 0 };
            byPeriod[key].open += t.profit || 0;
        });

        const sorted = Object.entries(byPeriod).sort(([a], [b]) => a.localeCompare(b));
        let cumulativeClosed = 0;
        return sorted.map(([period, d]) => {
            try {
                cumulativeClosed += d.closed;
                const label = periodMode === 'weekly'
                    ? format(parseISO(period), 'MMM dd')
                    : format(new Date(period + '-01T00:00:00Z'), 'MMM yy');
                return { week: label, closed: cumulativeClosed, open: d.open, date: period };
            } catch { return null; }
        }).filter(Boolean);
    }, [closedTrades, openTrades, periodMode]);

    // ── Win/Loss bar chart by week or month ──────────────────────────────────
    const winLossData = useMemo(() => {
        const byPeriod = {};
        closedTrades.forEach(t => {
            const dateStr = t.income_week || t.close_date || t.open_date;
            const d = parseDate(dateStr);
            if (!d) return;
            const key = periodMode === 'weekly'
                ? format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
                : format(d, 'yyyy-MM');
            if (!byPeriod[key]) byPeriod[key] = { wins: 0, losses: 0 };
            if ((t.profit || 0) >= 0) byPeriod[key].wins += 1;
            else byPeriod[key].losses += 1;
        });
        return Object.entries(byPeriod)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([period, d]) => {
                try {
                    const label = periodMode === 'weekly'
                        ? format(parseISO(period), 'MMM dd')
                        : format(new Date(period + '-01T00:00:00Z'), 'MMM yy');
                    const total = d.wins + d.losses;
                    return {
                        month: label,
                        winPct: total > 0 ? Math.round((d.wins / total) * 100) : 0,
                        lossPct: total > 0 ? Math.round((d.losses / total) * 100) : 0,
                        wins: d.wins,
                        losses: d.losses,
                    };
                } catch { return null; }
            })
            .filter(Boolean);
    }, [closedTrades, periodMode]);

    // ── Ticker performance matrix ─────────────────────────────────────────────
    const tickerMatrix = useMemo(() => {
        const byTicker = {};
        closedTrades.forEach(t => {
            if (!t.ticker) return;
            if (!byTicker[t.ticker]) byTicker[t.ticker] = { profit: 0, trades: 0, wins: 0 };
            byTicker[t.ticker].profit += t.profit || 0;
            byTicker[t.ticker].trades += 1;
            if ((t.profit || 0) > 0) byTicker[t.ticker].wins += 1;
        });
        return Object.entries(byTicker)
            .map(([ticker, d]) => ({
                ticker,
                profit: d.profit,
                trades: d.trades,
                wins: d.wins,
                losses: d.trades - d.wins,
                winRate: d.trades > 0 ? (d.wins / d.trades) * 100 : 0,
                avgProfit: d.trades > 0 ? d.profit / d.trades : 0,
            }))
            .sort((a, b) => b.profit - a.profit);
    }, [closedTrades]);

    // ── KPIs ─────────────────────────────────────────────────────────────────
    const kpis = useMemo(() => {
        const totalProfit = closedTrades.reduce((s, t) => s + (t.profit || 0), 0);
        const wins = closedTrades.filter(t => (t.profit || 0) > 0);
        const losses = closedTrades.filter(t => (t.profit || 0) < 0);
        const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
        const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.profit, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.profit, 0) / losses.length : 0;
        const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : null;

        // Avg weekly profit
        const weeklyProfits = cumulativeData.map(d => d.profit);
        const avgWeekly = weeklyProfits.length > 0 ? weeklyProfits.reduce((a, b) => a + b, 0) / weeklyProfits.length : 0;
        const annualized = avgWeekly * 52;

        // Best streak
        const sorted = [...closedTrades].sort((a, b) => {
            const da = parseDate(a.income_week || a.close_date || a.open_date)?.getTime() || 0;
            const db = parseDate(b.income_week || b.close_date || b.open_date)?.getTime() || 0;
            return da - db;
        });
        let maxStreak = 0, streak = 0;
        sorted.forEach(t => {
            if ((t.profit || 0) > 0) { streak++; maxStreak = Math.max(maxStreak, streak); }
            else streak = 0;
        });

        return { totalProfit, winRate, avgWin, avgLoss, profitFactor, maxStreak, totalTrades: closedTrades.length, avgWeekly, annualized };
    }, [closedTrades, cumulativeData]);



    if (!closedTrades.length) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                No closed trades with profit data available.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Period Toggle */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setPeriodMode('weekly')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        periodMode === 'weekly'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setPeriodMode('monthly')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        periodMode === 'monthly'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Monthly
                </button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Pill label="Win Rate" value={`${kpis.winRate.toFixed(1)}%`} sub={`${kpis.totalTrades > 0 ? Math.round(kpis.winRate / 100 * kpis.totalTrades) : 0}W / ${kpis.totalTrades > 0 ? Math.round((1 - kpis.winRate / 100) * kpis.totalTrades) : 0}L`} color="amber" icon={Target} />
                <Pill label="Profit Factor" value={kpis.profitFactor ? kpis.profitFactor.toFixed(2) + 'x' : 'N/A'} sub="avg win ÷ avg loss" color="slate" icon={Activity} />
                <Pill label="Best Streak" value={`${kpis.maxStreak} wins`} sub="consecutive profitable trades" color="amber" icon={Award} />
            </div>

            {/* Cumulative P&L Chart */}
            <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">Cumulative P&L</h2>
                <div className="p-4">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={cumulativeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                            <p className="font-semibold text-slate-700 mb-1">{label}</p>
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400" /><span className="text-slate-500">Closed:</span><span className="font-bold text-slate-700">{fmtFull(d?.closed)}</span></div>
                                            {d?.open !== 0 && <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${d?.open >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} /><span className="text-slate-500">Open:</span><span className={`font-bold ${d?.open >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(d?.open)}</span></div>}
                                        </div>
                                    );
                                }}
                            />
                            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
                            <Bar dataKey="closed" name="Closed" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="open" name="Open" stackId="a" radius={[3, 3, 0, 0]}>
                                {cumulativeData.map((entry, index) => (
                                    <Cell key={index} fill={entry.open >= 0 ? '#10b981' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Win / Loss Chart */}
            <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">Win / Loss by Month</h2>
                <div className="p-4">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={winLossData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                            <p className="font-semibold text-slate-700 mb-1">{label}</p>
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-slate-500">Wins:</span><span className="font-bold text-emerald-600">{d?.wins} ({d?.winPct}%)</span></div>
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-slate-500">Losses:</span><span className="font-bold text-rose-600">{d?.losses} ({d?.lossPct}%)</span></div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="winPct" name="Win %" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="lossPct" name="Loss %" stackId="a" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>



            {/* Ticker Matrix */}
            <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">Ticker Matrix</h2>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                {['Ticker', 'Total P&L', 'Trades', 'W / L', 'Win Rate', 'Avg/Trade'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tickerMatrix.map((row) => {
                                const maxProfit = Math.max(...tickerMatrix.map(r => Math.abs(r.profit)));
                                return (
                                    <tr key={row.ticker} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-800">{row.ticker}</td>
                                        <td className={`px-4 py-3 font-bold ${row.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(row.profit)}</td>
                                        <td className="px-4 py-3 text-slate-500">{row.trades}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-emerald-600 font-semibold">{row.wins}W</span>
                                            <span className="text-slate-300 mx-1">/</span>
                                            <span className="text-rose-500 font-semibold">{row.losses}L</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full bg-indigo-400" style={{ width: `${row.winRate}%` }} />
                                                </div>
                                                <span className="text-slate-600">{row.winRate.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${row.avgProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtFull(row.avgProfit)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}