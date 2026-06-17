import React from 'react';
import { ArrowRight, ChevronRight, Hexagon, Crosshair } from 'lucide-react';

const IMAGES = {
    commandCenter: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/13fea25b9_generated_image.png',
    factoryFloor: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/f723238dc_generated_image.png',
    hudRadar: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/ce4a56e84_generated_image.png',
    brutalistBg: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/59c85a79b_generated_image.png',
};

export default function AndurilLanding({ navigate, openView }) {
    return (
        <div className="bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>
            {/* Nav bar */}
            <div className="border-b border-white/[0.06] backdrop-blur-sm bg-black/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-white/80">
                            <path d="M10 1L19 18H1L10 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <span className="text-sm font-bold tracking-[0.05em]">DASKAPITALIST</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-[11px] text-white/25 font-medium tracking-wide">
                        <span className="text-white/80">Track Record</span>
                        <span>Streaks</span>
                        <span>Edge</span>
                        <span>Exposure</span>
                        <span className="flex items-center gap-1">Arsenal <span className="text-[8px]">+</span></span>
                    </div>
                </div>
            </div>

            {/* ===== HERO ===== */}
            <div className="relative overflow-hidden min-h-screen flex items-center">
                {/* Main hero image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${IMAGES.commandCenter})`,
                            filter: 'brightness(0.4) saturate(0.5) contrast(1.2)',
                            transform: 'scale(1.03)',
                        }}
                    />
                    {/* Deep gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 via-black/30 to-black/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent via-50% to-black/50" />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                {/* Geometric accent lines */}
                <div className="absolute top-0 right-0 w-1/3 h-full z-0 opacity-[0.03]">
                    <div className="absolute top-1/4 right-10 w-px h-64 bg-white" />
                    <div className="absolute top-1/3 right-20 w-px h-48 bg-white" />
                    <div className="absolute bottom-1/4 right-16 w-32 h-px bg-white" />
                    <div className="absolute top-1/2 right-10 w-20 h-px bg-white" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 lg:py-40 w-full">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-3 space-y-12">
                            <div>
                                <div className="flex items-center gap-3 text-white/25 text-[10px] font-medium tracking-[0.3em] uppercase mb-8">
                                    <div className="h-px w-10 bg-white/15" />
                                    Options Intelligence
                                    <div className="h-px w-10 bg-white/15" />
                                </div>
                                <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-light leading-[0.88] tracking-tight">
                                    First to see.
                                    <br />
                                    First to act.
                                </h1>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-px h-20 bg-white/10 mt-1" />
                                <p className="text-base lg:text-lg text-white/35 font-light max-w-lg leading-relaxed">
                                    The market telegraphs its moves before they happen. Most traders lack the sensory apparatus to read it. DasKapitalist gives you the optics.
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => navigate('/Trades')}
                                    className="group inline-flex items-center gap-3 px-9 py-4 border border-white/15 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/50 hover:bg-white/[0.04] transition-all"
                                >
                                    Enter platform
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/8 text-3xl font-thin">&gt;K</span>
                                    <div className="flex gap-1">
                                        <div className="w-5 h-px bg-white/10" />
                                        <div className="w-3 h-px bg-white/5" />
                                        <div className="w-2 h-px bg-white/[0.03]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - ambient tech pattern */}
                        <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
                            <div className="relative w-full aspect-square">
                                {/* Radar circle pattern */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                                    <div className="w-full h-full rounded-full border border-white" style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)' }} />
                                    <div className="absolute w-3/4 h-3/4 rounded-full border border-white" />
                                    <div className="absolute w-1/2 h-1/2 rounded-full border border-white" />
                                    <div className="absolute w-1/4 h-1/4 rounded-full border border-white" />
                                    <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-white -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-white -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                {/* Center hex */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Hexagon className="w-16 h-16 text-white/[0.03] stroke-[0.5]" />
                                </div>
                                <div className="absolute bottom-10 right-10 text-white/[0.04] text-[8px] font-mono tracking-[0.3em]">SYS.ONLINE</div>
                                <div className="absolute top-10 left-10 text-white/[0.04] text-[8px] font-mono tracking-[0.3em]">NODE.01</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade to next section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
            </div>

            {/* ===== MISSION STRIP ===== */}
            <div className="relative border-y border-white/[0.06] overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] bg-cover bg-center"
                    style={{ backgroundImage: `url(${IMAGES.hudRadar})`, backgroundSize: 'cover' }}
                />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-5">
                    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 text-[9px] font-medium text-white/15 tracking-[0.3em] uppercase">
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            SENSING
                        </span>
                        <span className="text-white/[0.04] hidden lg:inline">•</span>
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            ANALYSIS
                        </span>
                        <span className="text-white/[0.04] hidden lg:inline">•</span>
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            DECISION
                        </span>
                        <span className="text-white/[0.04] hidden lg:inline">•</span>
                        <span className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            EXECUTION
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== CAPABILITIES GRID with image ===== */}
            <div className="relative overflow-hidden">
                {/* Background image behind capabilities */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${IMAGES.hudRadar})`,
                            filter: 'brightness(0.15) saturate(0.2)',
                            transform: 'scale(1.1)',
                        }}
                    />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 px-6 lg:px-10 py-28">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-px w-12 bg-white/10" />
                            <span className="text-[10px] font-medium text-white/15 tracking-[0.3em] uppercase">Capabilities</span>
                            <div className="h-px w-12 bg-white/10" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            {[
                                {
                                    title: 'Track Record',
                                    tag: 'SITUATIONAL AWARENESS',
                                    desc: 'Complete operational history. Every position. Every outcome. Your financial sensor array — no blind spots.',
                                    action: () => openView('time'),
                                    accent: 'border-l-2 border-white/20',
                                },
                                {
                                    title: 'Streaks',
                                    tag: 'PATTERN RECOGNITION',
                                    desc: 'Temporal performance mapping. Week-over-week conviction tracking. Find the rhythm in the noise.',
                                    action: () => openView('weekly'),
                                    accent: 'border-l-2 border-white/10',
                                },
                                {
                                    title: 'Edge',
                                    tag: 'TARGET ACQUISITION',
                                    desc: 'Asset-level profitability matrix. Which tickers deliver alpha — and which are resource-draining distractions.',
                                    action: () => openView('ticker'),
                                    accent: 'border-l-2 border-white/10',
                                },
                                {
                                    title: 'Exposure',
                                    tag: 'BATTLEFIELD VISUALIZATION',
                                    desc: 'Single-glance risk topography. Everything open, sized by capital, colored by performance. Total clarity.',
                                    action: () => openView('open'),
                                    accent: 'border-l-2 border-white/[0.06]',
                                },
                            ].map((item, i) => (
                                <div key={i} className={`p-10 lg:p-14 bg-black group hover:bg-white/[0.015] transition-colors ${item.accent}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-light text-white/10 tracking-[0.2em]">0{i+1}</span>
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-light tracking-tight mb-2">{item.title}</h3>
                                    <div className="text-[10px] font-medium text-white/10 tracking-[0.2em] uppercase mb-4">{item.tag}</div>
                                    <p className="text-sm text-white/25 leading-relaxed max-w-sm">{item.desc}</p>
                                    <button onClick={item.action} className="inline-flex items-center gap-2 text-xs font-medium text-white/30 mt-6 hover:text-white/70 transition-colors group">
                                        View capability
                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== PERFORMANCE STRIP ===== */}
            <div className="relative border-y border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.04]">
                        {[
                            { value: '62.4%', label: 'Win Rate' },
                            { value: '1.83×', label: 'Profit Factor' },
                            { value: '+$47,280', label: 'Cumulative P&L' },
                            { value: '847', label: 'Missions Closed' },
                        ].map((stat, i) => (
                            <div key={i} className="py-10 flex flex-col items-center text-center group cursor-default">
                                <div className="text-2xl lg:text-3xl font-light tracking-tight group-hover:text-white/90 transition-colors">{stat.value}</div>
                                <div className="text-[9px] font-medium text-white/10 tracking-[0.25em] uppercase mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== ARSENAL with dramatic image ===== */}
            <div className="relative overflow-hidden">
                {/* Factory floor image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed"
                        style={{
                            backgroundImage: `url(${IMAGES.factoryFloor})`,
                            filter: 'brightness(0.2) saturate(0.3) contrast(1.3)',
                            transform: 'scale(1.03)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                    {/* Subtle diagonal lines */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)',
                    }} />
                </div>

                <div className="relative z-10 px-6 lg:px-10 py-28">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-px w-12 bg-white/10" />
                            <Crosshair className="w-3 h-3 text-white/10" />
                            <span className="text-[10px] font-medium text-white/20 tracking-[0.3em] uppercase">Arsenal</span>
                            <div className="h-px w-12 bg-white/10" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.02] tracking-tight">
                                    Rebuild the
                                    <br />
                                    arsenal.
                                </h2>
                                <div className="flex items-start gap-5">
                                    <div className="w-px h-16 bg-white/8 mt-1" />
                                    <p className="text-sm text-white/25 leading-relaxed max-w-md">
                                        Designed for traders who operate at speed. Built with precision. Deployed in your browser. A new standard in portfolio intelligence.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate('/Trades')}
                                        className="group inline-flex items-center gap-3 px-9 py-4 border border-white/15 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/50 hover:bg-white/[0.04] transition-all"
                                    >
                                        Enter the arsenal
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Asset grid with visual styling */}
                            <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                                {[
                                    { ticker: 'GLD', pnl: '+$14.2K', wr: '83%', barW: '83%' },
                                    { ticker: 'QQQ', pnl: '+$11.8K', wr: '71%', barW: '71%' },
                                    { ticker: 'SPY', pnl: '+$8.3K', wr: '64%', barW: '64%' },
                                    { ticker: 'TSLA', pnl: '-$4.9K', wr: '38%', barW: '38%', negative: true },
                                ].map((row, i) => (
                                    <div key={i} className="p-7 bg-black">
                                        <div className="text-lg font-light tracking-tight">{row.ticker}</div>
                                        <div className={`text-lg font-light tracking-tight mt-1 ${row.negative ? 'text-red-400/60' : 'text-white/50'}`}>
                                            {row.pnl}
                                        </div>
                                        {/* Win rate bar */}
                                        <div className="mt-3 h-px w-full bg-white/[0.04]">
                                            <div
                                                className={`h-px ${row.negative ? 'bg-red-400/40' : 'bg-white/20'}`}
                                                style={{ width: row.barW }}
                                            />
                                        </div>
                                        <div className="text-[8px] font-medium text-white/8 tracking-[0.2em] uppercase mt-2">{row.wr} win rate</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CLOSING CTA ===== */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-28 text-center">
                    <div className="max-w-xl mx-auto space-y-10">
                        {/* Radar dot decoration */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-3 h-3 rounded-full border border-white/[0.06]" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light leading-[1.1] tracking-tight">
                            The market doesn't wait.
                            <br />
                            <span className="text-white/40">Neither should you.</span>
                        </h2>
                        <p className="text-sm text-white/25 leading-relaxed max-w-md mx-auto">
                            Most traders are reacting. You'll be anticipating. DasKapitalist is the difference between a guess and a read.
                        </p>
                        <button
                            onClick={() => navigate('/Trades')}
                            className="group inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/50 hover:bg-white/[0.04] transition-all"
                        >
                            Enter platform
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-white/10">
                            <path d="M10 1L19 18H1L10 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <span className="text-[9px] font-medium text-white/8 tracking-[0.25em] uppercase">DasKapitalist</span>
                        <div className="w-px h-3 bg-white/[0.04]" />
                        <span className="text-[9px] font-medium text-white/5 tracking-[0.25em] uppercase">INTELLIGENCE DIVISION</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-medium text-white/[0.03] tracking-[0.2em] uppercase">Designed for traders</span>
                        <span className="text-[9px] font-medium text-white/[0.03] tracking-[0.2em] uppercase">Built for performance</span>
                    </div>
                </div>
            </div>
        </div>
    );
}