import React, { useState, useMemo, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fmtCurrency = (v) => {
    if (!v && v !== 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
};

const fmtPct = (v) => {
    if (v === null || v === undefined) return null;
    return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
};

export default function Home() {
    const [priceData, setPriceData] = useState({}); // { ticker: { change_pct, price } }
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [manualGains] = useState({});

    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
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
        const result = {};
        await Promise.all(
            tickers.map(async (ticker) => {
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
        if (changePct === null || changePct === undefined) return { bg: '#e2e8f0', text: '#64748b' };
        if (changePct >= 3) return { bg: '#065f46', text: '#fff' };
        if (changePct >= 1.5) return { bg: '#059669', text: '#fff' };
        if (changePct >= 0.5) return { bg: '#34d399', text: '#064e3b' };
        if (changePct >= 0) return { bg: '#a7f3d0', text: '#064e3b' };
        if (changePct >= -0.5) return { bg: '#fecaca', text: '#7f1d1d' };
        if (changePct >= -1.5) return { bg: '#f87171', text: '#fff' };
        if (changePct >= -3) return { bg: '#dc2626', text: '#fff' };
        return { bg: '#7f1d1d', text: '#fff' };
    };

    const totalDayPnL = useMemo(() => {
        return Object.values(manualGains).reduce((s, v) => s + (v || 0), 0);
    }, [manualGains]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-slate-400">Loading positions...</div>;
    }

    if (!openPositions.length) {
        return <div className="flex items-center justify-center h-64 text-slate-400">No open positions.</div>;
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Today's Exposure</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {openPositions.length} open positions · {fmtCurrency(totalCollateral)} collateral at risk
                            {lastUpdated && <span className="ml-2 text-slate-400">· Updated {lastUpdated.toLocaleTimeString()}</span>}
                        </p>
                    </div>
                    <Button onClick={fetchPrices} disabled={loadingPrices} className="gap-2 self-start">
                        <RefreshCw className={`w-4 h-4 ${loadingPrices ? 'animate-spin' : ''}`} />
                        {loadingPrices ? 'Fetching Prices...' : 'Refresh Prices'}
                    </Button>
                </div>

                {/* Day P&L Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Est. Day P&L</div>
                        <div className={`text-2xl font-bold ${totalDayPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {fmtCurrency(totalDayPnL)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">manual entries below</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Positions Up</div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {openPositions.filter(p => (priceData[p.ticker]?.change_pct ?? null) >= 0 && priceData[p.ticker] !== null && priceData[p.ticker] !== undefined).length}
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Positions Down</div>
                        <div className="text-2xl font-bold text-rose-600">
                            {openPositions.filter(p => (priceData[p.ticker]?.change_pct ?? null) < 0).length}
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <div>
                    <h2 className="text-base font-semibold text-slate-800 mb-3">
                        Position Heatmap <span className="text-xs font-normal text-slate-400">— size = collateral, color = today's price change</span>
                    </h2>
                    {!lastUpdated && (
                        <p className="text-xs text-slate-400 mb-3 italic">Hit "Refresh Prices" to color by today's change. Tiles are sized by collateral.</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {openPositions.map(pos => {
                            const pd = priceData[pos.ticker];
                            const changePct = pd?.change_pct ?? null;
                            const { bg, text } = getColor(changePct);
                            // Size: min 80px, scale with collateral share
                            const share = totalCollateral > 0 ? pos.collateral / totalCollateral : 1 / openPositions.length;
                            const size = Math.max(80, Math.min(220, Math.round(share * 1200)));
                            return (
                                <div
                                    key={pos.ticker}
                                    style={{ width: size, height: size, background: bg, color: text, transition: 'background 0.5s' }}
                                    className="rounded-xl flex flex-col items-center justify-center p-2 shadow-sm border border-white/20"
                                >
                                    <span className="text-lg font-bold leading-tight">{pos.ticker}</span>
                                    <span className="text-xs font-medium mt-0.5">{fmtCurrency(pos.collateral)}</span>
                                    {changePct !== null ? (
                                        <span className="text-xs font-semibold mt-1">{fmtPct(changePct)}</span>
                                    ) : (
                                        <span className="text-[10px] opacity-50 mt-1">no data</span>
                                    )}
                                    {pd?.price && <span className="text-[10px] opacity-70">${pd.price.toFixed(2)}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>
        </div>
    );
}