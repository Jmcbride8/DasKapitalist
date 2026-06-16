import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { createPageUrl } from '@/utils';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import DarkOpsLanding from '@/components/landing/DarkOpsLanding';

export default function DesignOptions() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const openView = (view) => {
        navigate(createPageUrl(`Dashboards?view=${view}`));
    };

    // Admin gate
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F2' }}>
                <div className="text-center space-y-4">
                    <ShieldAlert className="w-12 h-12 mx-auto text-black/20" />
                    <h1 className="text-2xl font-black text-black">Admin Access Required</h1>
                    <p className="text-sm text-black/40">Only admin users can access design options.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
            {/* Page header */}
            <div className="border-b border-black/10" style={{ backgroundColor: '#F9F7F2' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-black">Design Options</h1>
                        <p className="text-xs font-medium text-black/30 mt-1">Review and compare landing page designs</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-black/20 uppercase tracking-wider">
                            Admin Only
                        </span>
                        <span className="h-3 w-3 rounded-full bg-black" />
                    </div>
                </div>
            </div>

            {/* Design 1: Paper & Ink Brutalism */}
            <div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-1 bg-black" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-black">01 — Paper & Ink Brutalism</h2>
                                <span className="text-[9px] font-bold text-white bg-black px-2 py-0.5 uppercase tracking-wider">Current</span>
                            </div>
                            <p className="text-xs font-medium text-black/30 mt-0.5">Parchment texture, black ink typography, red danger accents, medical line-art</p>
                        </div>
                    </div>
                </div>

                {/* Landing page embed */}
                <div className="border-y border-black/10">
                    <BrutalistLanding navigate={navigate} openView={openView} />
                </div>
            </div>

            {/* Design 2: Dark Ops */}
            <div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-1 bg-black" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-black">02 — Dark Ops</h2>
                                <span className="text-[9px] font-bold text-white bg-black px-2 py-0.5 uppercase tracking-wider">Alternative</span>
                            </div>
                            <p className="text-xs font-medium text-black/30 mt-0.5">Dark cinematic, masculine, "be a rebel" energy — inspired by safedc.gov</p>
                        </div>
                    </div>
                </div>

                <div className="border-y border-black/10">
                    <DarkOpsLanding navigate={navigate} openView={openView} />
                </div>
            </div>

            {/* Future designs placeholder */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="border border-dashed border-black/10 p-12 text-center">
                    <p className="text-lg font-black text-black/15">More design options coming soon</p>
                    <p className="text-xs font-medium text-black/10 mt-2">Additional landing page variants will appear here</p>
                </div>
            </div>
        </div>
    );
}

function BrutalistLanding({ navigate, openView }) {
    return (
        <div
            className="text-black overflow-x-hidden"
            style={{
                backgroundColor: '#F9F7F2',
                backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/59c85a79b_generated_image.png)',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="max-w-7xl mx-auto lg:flex lg:flex-row min-h-screen relative">
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-black/20" style={{ zIndex: 1 }} />

                {/* === LEFT COLUMN === */}
                <div className="lg:w-1/2 relative">
                    <div className="sticky top-0 px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-center min-h-screen">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-10 bg-black" />
                                <span className="text-[10px] font-black text-black tracking-[0.25em] uppercase">
                                    FOR OPTIONS TRADERS
                                </span>
                            </div>

                            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.88] tracking-tight">
                                90% of day
                                <br />
                                traders lose
                                <br />
                                money. Don't.
                            </h1>

                            <div className="flex items-baseline gap-3">
                                <span className="text-7xl lg:text-8xl font-black">90%</span>
                                <span className="text-[10px] font-bold text-black/50 max-w-[120px] leading-tight uppercase tracking-wider">
                                    of retail traders lose money in their first year
                                </span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => navigate(createPageUrl('Trades'))}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-[#F9F7F2] font-black text-xs tracking-wider uppercase hover:bg-black/90 transition-all group"
                                >
                                    Launch the app
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                                <button
                                    onClick={() => document.getElementById('dashboards-design').scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-black text-black font-black text-xs tracking-wider uppercase hover:bg-black/[0.02] transition-all group"
                                >
                                    See how it works
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-16 lg:pt-20">
                            <div className="h-px w-16 bg-black mb-8" />

                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D9261C] bg-[#D9261C]/5">
                                    <span className="text-[9px] font-black text-[#D9261C] tracking-[0.2em] uppercase">THE ANIMAL</span>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight">
                                    You are a lizard
                                    <br />
                                    wearing a suit.
                                </h2>

                                <div className="space-y-4 text-sm leading-relaxed font-medium" style={{ color: '#333' }}>
                                    <p>
                                        The moment your position turns red, your amygdala fires. The same neural circuit that kept your ancestors alive when they saw a predator. Cortisol floods your system. Your prefrontal cortex — the part that does math, strategy, risk management — goes offline.
                                    </p>
                                    <p>
                                        You know what happens next. You close the winner too early. You let the loser run because closing means admitting you were wrong. You revenge-trade. You break every rule in your playbook.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 relative">
                                <img
                                    src="https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/1556f84eb_generated_image.png"
                                    alt="Anatomical brain drawing showing amygdala hijack during trading stress"
                                    className="w-full h-auto"
                                />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h3 className="text-xl font-black tracking-tight uppercase">CORTISOL HIJACKS REASON</h3>
                                <p className="text-sm leading-relaxed font-medium" style={{ color: '#333' }}>
                                    You don't need a better strategy. You need a system that works <span className="text-black font-bold">when your brain doesn't.</span>
                                </p>
                            </div>

                            <div className="mt-16">
                                <div className="h-px w-full bg-black/10 mb-6" />
                                <p className="text-base font-black italic leading-relaxed text-black/40">
                                    &ldquo;The stock market is a device for transferring money from the impatient to the patient.&rdquo;
                                </p>
                                <p className="text-[10px] font-bold text-black/25 mt-2 uppercase tracking-wider">
                                    — Warren Buffett
                                </p>
                            </div>

                            <div className="mt-10">
                                <button
                                    onClick={() => navigate(createPageUrl('Trades'))}
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-[#F9F7F2] font-black text-xs tracking-wider uppercase hover:bg-black/90 transition-all group"
                                >
                                    Launch the app
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT COLUMN === */}
                <div id="dashboards-design" className="lg:w-1/2 relative">
                    <div className="px-6 lg:px-12 py-12 lg:py-16">
                        <div className="space-y-6 mb-16">
                            <div className="h-px w-16 bg-black mb-8" />
                            <h2 className="text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight">
                                Four dashboards
                                <br />
                                that do what your
                                <br />
                                brain can't.
                            </h2>
                        </div>

                        <div className="space-y-16 lg:space-y-20">
                            {/* 01 Track Record */}
                            <div>
                                <div className="h-px w-full bg-black/10 mb-8" />
                                <div className="text-8xl font-black text-black/5 leading-none">01</div>
                                <h3 className="text-3xl font-black tracking-tight mt-1">Track Record</h3>
                                <p className="text-sm font-medium text-black/40 mt-2 max-w-sm leading-relaxed">
                                    Your real P&L. Not the sanitized number your broker shows.
                                </p>

                                <div className="mt-6 border border-black p-6">
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div><div className="text-2xl font-black">62%</div><div className="text-[9px] font-bold text-black/30 uppercase tracking-wider mt-0.5">Win Rate</div></div>
                                        <div><div className="text-2xl font-black">1.8×</div><div className="text-[9px] font-bold text-black/30 uppercase tracking-wider mt-0.5">Profit Factor</div></div>
                                        <div><div className="text-2xl font-black" style={{ color: '#D9261C' }}>+$342</div><div className="text-[9px] font-bold text-black/30 uppercase tracking-wider mt-0.5">Avg Trade</div></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-black/60">Cumulative P&L</span>
                                            <span className="font-black" style={{ color: '#D9261C' }}>+$47,280</span>
                                        </div>
                                        <div className="h-2 bg-black/5"><div className="h-full bg-black" style={{ width: '72%' }} /></div>
                                        <div className="flex justify-between text-[8px] font-bold text-black/15">
                                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => openView('time')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-4 hover:gap-3 transition-all group">
                                    Open Track Record <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>

                            {/* 02 Streaks */}
                            <div>
                                <div className="h-px w-full bg-black/10 mb-8" />
                                <div className="text-8xl font-black text-black/5 leading-none">02</div>
                                <h3 className="text-3xl font-black tracking-tight mt-1">Streaks</h3>
                                <p className="text-sm font-medium text-black/40 mt-2 max-w-sm leading-relaxed">
                                    Every W and L, week by week. Your brain forgets patterns — this doesn't.
                                </p>

                                <div className="mt-6 border border-black p-6">
                                    <div className="flex gap-2 flex-wrap mb-6">
                                        {['W','W','W','W','L','W','W','W','W','W','W','L','W','W'].map((r, i) => (
                                            <div key={i} className="w-9 h-9 flex items-center justify-center text-[10px] font-black border"
                                                style={{ backgroundColor: r === 'W' ? '#000' : '#F9F7F2', color: r === 'W' ? '#F9F7F2' : '#000', borderColor: '#000' }}>
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[{ label: 'Current', value: '3 wins', color: '#000' }, { label: 'Best ever', value: '11 wins', color: '#000' }, { label: 'Worst ever', value: '1 loss', color: '#D9261C' }].map((s, i) => (
                                            <div key={i} className="border border-black/10 p-3" style={{ backgroundColor: '#F9F7F2' }}>
                                                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                                                <div className="text-[8px] font-bold text-black/20 uppercase tracking-wider mt-0.5">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => openView('weekly')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-4 hover:gap-3 transition-all group">
                                    Open Streaks <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>

                            {/* 03 Edge */}
                            <div>
                                <div className="h-px w-full bg-black/10 mb-8" />
                                <div className="text-8xl font-black text-black/5 leading-none">03</div>
                                <h3 className="text-3xl font-black tracking-tight mt-1">Edge</h3>
                                <p className="text-sm font-medium text-black/40 mt-2 max-w-sm leading-relaxed">
                                    Which tickers make you money — and which are expensive hobbies.
                                </p>

                                <div className="mt-6 border border-black">
                                    {[
                                        { ticker: 'GLD', pnl: '+$14,200', wr: '83%', danger: false },
                                        { ticker: 'QQQ', pnl: '+$11,840', wr: '71%', danger: false },
                                        { ticker: 'SPY', pnl: '+$8,300', wr: '64%', danger: false },
                                        { ticker: 'NVDA', pnl: '+$3,100', wr: '55%', danger: false },
                                        { ticker: 'TSLA', pnl: '-$4,920', wr: '38%', danger: true },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-black/10 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black tracking-tight">{t.ticker}</span>
                                                <span className="text-[10px] font-bold text-black/25">{t.wr} WR</span>
                                                {t.danger && <span className="text-[8px] font-black text-[#D9261C] border border-[#D9261C] px-2 py-0.5 uppercase tracking-wider">DANGER</span>}
                                            </div>
                                            <span className="text-sm font-black font-mono" style={{ color: t.danger ? '#D9261C' : '#000' }}>{t.pnl}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => openView('ticker')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-4 hover:gap-3 transition-all group">
                                    Open Edge <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>

                            {/* 04 Exposure */}
                            <div>
                                <div className="h-px w-full bg-black/10 mb-8" />
                                <div className="text-8xl font-black text-black/5 leading-none">04</div>
                                <h3 className="text-3xl font-black tracking-tight mt-1">Exposure</h3>
                                <p className="text-sm font-medium text-black/40 mt-2 max-w-sm leading-relaxed">
                                    A live treemap of everything open. Size = risk. One glance.
                                </p>

                                <div className="mt-6 border border-black p-6">
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                            { size: 3, label: 'GLD', bg: '#000', text: '#F9F7F2' },
                                            { size: 2, label: 'SPY', bg: '#333', text: '#F9F7F2' },
                                            { size: 1, label: 'QQQ', bg: '#555', text: '#F9F7F2' },
                                            { size: 2, label: 'NVDA', bg: '#777', text: '#F9F7F2' },
                                            { size: 1, label: 'NEM', bg: '#999', text: '#000' },
                                            { size: 2, label: 'TSLA', bg: '#D9261C', text: '#F9F7F2' },
                                            { size: 1, label: 'CDE', bg: '#CCC', text: '#000' },
                                            { size: 1, label: 'SIL', bg: '#DDD', text: '#000' },
                                            { size: 1, label: 'HL', bg: '#EEE', text: '#000' },
                                        ].map((tile, i) => (
                                            <div key={i} className="flex items-center justify-center font-black text-[10px] tracking-tight"
                                                style={{ backgroundColor: tile.bg, color: tile.text, gridRow: `span ${tile.size}`, minHeight: tile.size === 3 ? '90px' : tile.size === 2 ? '58px' : '28px' }}>
                                                {tile.label}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-black/10">
                                        <span className="text-[10px] font-bold text-black/25 uppercase tracking-wider">14 positions</span>
                                        <span className="text-[10px] font-black text-black/60 uppercase tracking-wider">$386K at risk</span>
                                    </div>
                                </div>

                                <button onClick={() => openView('open')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-4 hover:gap-3 transition-all group">
                                    Open Exposure <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-20">
                            <div className="h-px w-full bg-black mb-8" />
                            <h2 className="text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight mb-3">Don't be<br />the 90%.</h2>
                            <p className="text-sm font-medium text-black/40 max-w-sm leading-relaxed mb-8">
                                Your broker shows you positions. We show you who you are as a trader.
                            </p>
                            <button onClick={() => navigate(createPageUrl('Trades'))} className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-[#F9F7F2] font-black text-xs tracking-wider uppercase hover:bg-black/90 transition-all group">
                                Start tracking <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        <div className="mt-20 pt-6 border-t border-black/10 flex justify-between items-center">
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-wider">DasKapitalist</span>
                            <span className="text-[10px] font-bold text-black/15 uppercase tracking-wider">Built for traders, by traders.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}