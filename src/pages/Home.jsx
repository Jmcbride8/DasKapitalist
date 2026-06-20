import React, { useState, useMemo, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const fmtCurrency = (v) => {
    if (!v && v !== 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
};

const fmtPct = (v) => {
    if (v === null || v === undefined) return null;
    return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
};

export default function Home() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [priceData, setPriceData] = useState({}); // { ticker: { change_pct, price } }
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [manualGains] = useState({});

    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades', user?.id],
        queryFn: () => base44.entities.Trade.filter({ created_by_id: user?.id }, '-open_date'),
        enabled: !!user?.id
    });

    // Aggregate open positions by ticker
    const openPositions = useMemo(() => {
        const byTicker = {};
        trades.filter(t => t.status === 'Open').forEach(t => {
            if (!t.ticker) return;
            if (!byTicker[t.ticker]) byTicker[t.ticker] = { ticker: t.ticker, collateral: 0, unrealized: 0, count: 0 };
            byTicker[t.ticker].collateral += t.collateral_start || 0;
            byTicker[t.ticker].unrealized += t.profit || 0;
            byTicker[t.ticker].count += 1;
        });
        return Object.values(byTicker).sort((a, b) => b.collateral - a.collateral);
    }, [trades]);

    const tickers = useMemo(() => openPositions.map(p => p.ticker), [openPositions]);

    const fetchPrices = useCallback(async () => {
        if (!tickers.length) return;
        setLoadingPrices(true);
        const allTickers = [...tickers, 'SPY'];
        const result = {};
        await Promise.all(
            allTickers.map(async (ticker) => {
                try {
                    const res = await base44.integrations.Core.InvokeLLM({
                        prompt: `Return today's price change percentage for stock ticker ${ticker}. Return only a JSON object with keys: price (current price as number), change_pct (percentage change today as number, e.g. 1.5 for +1.5%, -2.3 for -2.3%).`,
                        add_context_from_internet: true,
                        response_json_schema: {
                            type: 'object',
                            properties: {
                                price: { type: 'number' },
                                change_pct: { type: 'number' }
                            }
                        }
                    });
                    result[ticker] = res;
                } catch {
                    result[ticker] = null;
                }
            })
        );
        setPriceData(result);
        setLastUpdated(new Date());
        setLoadingPrices(false);
    }, [tickers]);

    const totalCollateral = useMemo(() => openPositions.reduce((s, p) => s + p.collateral, 0), [openPositions]);

    // Color based on change_pct
    const getColor = (changePct) => {
        if (changePct === null || changePct === undefined) return isDark
            ? { bg: '#1e293b', text: '#94a3b8' }
            : { bg: '#e2e8f0', text: '#64748b' };
        if (changePct >= 3) return { bg: '#065f46', text: '#fff' };
        if (changePct >= 1.5) return { bg: '#059669', text: '#fff' };
        if (changePct >= 0.5) return { bg: '#34d399', text: '#064e3b' };
        if (changePct >= 0) return { bg: '#a7f3d0', text: '#064e3b' };
        if (changePct >= -0.5) return { bg: '#fecaca', text: '#7f1d1d' };
        if (changePct >= -1.5) return { bg: '#f87171', text: '#fff' };
        if (changePct >= -3) return { bg: '#dc2626', text: '#fff' };
        return { bg: '#7f1d1d', text: '#fff' };
    };



    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-slate-400 dark:bg-zinc-950 w-full">Loading positions...</div>;
    }

    if (!openPositions.length) {
        return <div className="flex items-center justify-center h-64 text-slate-400 dark:bg-zinc-950 w-full">No open positions.</div>;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#111413] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Today's Exposure</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {openPositions.length} open positions · {fmtCurrency(totalCollateral)} collateral at risk
                            {lastUpdated && <span className="ml-2 text-slate-400">· Updated {lastUpdated.toLocaleTimeString()}</span>}
                        </p>
                    </div>
                    <Button onClick={fetchPrices} disabled={loadingPrices} className="gap-2 self-start">
                        <RefreshCw className={`w-4 h-4 ${loadingPrices ? 'animate-spin' : ''}`} />
                        {loadingPrices ? 'Fetching Prices...' : 'Refresh Prices'}
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">S&P 500 (SPY)</div>
                        {priceData['SPY'] ? (
                            <>
                                <div className={`text-2xl font-bold ${priceData['SPY'].change_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {fmtPct(priceData['SPY'].change_pct)}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">${priceData['SPY'].price?.toFixed(2)}</div>
                            </>
                        ) : (
                            <div className="text-2xl font-bold text-slate-300">—</div>
                        )}
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">Positions Up</div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {openPositions.filter(p => (priceData[p.ticker]?.change_pct ?? null) >= 0 && priceData[p.ticker] !== null && priceData[p.ticker] !== undefined).length}
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">Positions Down</div>
                        <div className="text-2xl font-bold text-rose-600">
                            {openPositions.filter(p => (priceData[p.ticker]?.change_pct ?? null) < 0).length}
                        </div>
                    </div>
                </div>

                {/* Treemap */}
                <div>
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        Position Treemap <span className="text-xs font-normal text-slate-400">— size = collateral, color = today's price change</span>
                    </h2>
                    {!lastUpdated && (
                        <p className="text-xs text-slate-400 mb-3 italic">Hit "Refresh Prices" to color by today's change. Tiles are sized by collateral.</p>
                    )}
                    <ResponsiveContainer width="100%" height={420}>
                        <Treemap
                            data={openPositions.map(pos => {
                                const pd = priceData[pos.ticker];
                                const changePct = pd?.change_pct ?? null;
                                return {
                                    name: pos.ticker,
                                    size: pos.collateral || 1,
                                    collateral: pos.collateral,
                                    changePct,
                                    price: pd?.price ?? null,
                                };
                            })}
                            dataKey="size"
                            content={({ x, y, width, height, name, collateral, changePct, price }) => {
                                const { bg, text } = getColor(changePct);
                                if (width < 10 || height < 10) return null;
                                return (
                                    <g>
                                        <rect x={x} y={y} width={width} height={height} fill={bg} stroke={isDark ? '#0d0f0e' : '#fff'} strokeWidth={2} rx={6} />
                                        {width > 50 && height > 40 && (
                                            <>
                                                <text x={x + width / 2} y={y + height / 2 - (height > 60 ? 14 : 6)} textAnchor="middle" fill={text} fontSize={Math.min(16, width / 5)} fontWeight="bold">
                                                    {name}
                                                </text>
                                                {height > 55 && (
                                                    <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill={text} fontSize={Math.min(11, width / 7)} opacity={0.85}>
                                                        {fmtCurrency(collateral)}
                                                    </text>
                                                )}
                                                {height > 70 && changePct !== null && (
                                                    <text x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle" fill={text} fontSize={Math.min(11, width / 7)} fontWeight="600">
                                                        {fmtPct(changePct)}
                                                    </text>
                                                )}
                                                {height > 85 && price != null && (
                                                    <text x={x + width / 2} y={y + height / 2 + 32} textAnchor="middle" fill={text} fontSize={Math.min(10, width / 8)} opacity={0.7}>
                                                        ${(price || 0).toFixed(2)}
                                                    </text>
                                                )}
                                            </>
                                        )}
                                    </g>
                                );
                            }}
                        >
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.root || payload[0]?.payload;
                                    if (!d?.name) return null;
                                    return (
                                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                            <p className="font-bold text-slate-800">{d.name}</p>
                                            <p className="text-slate-500">Collateral: {fmtCurrency(d.collateral)}</p>
                                            {d.changePct !== null && <p className={d.changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}>Change: {fmtPct(d.changePct)}</p>}
                                            {d.price != null && <p className="text-slate-500">Price: ${(d.price || 0).toFixed(2)}</p>}
                                        </div>
                                    );
                                }}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                </div>


            </div>
        </div>
    );
}