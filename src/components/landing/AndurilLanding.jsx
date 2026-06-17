import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function AndurilLanding({ navigate, openView }) {
    return (
        <div className="bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>
            {/* Nav bar */}
            <div className="border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                            <path d="M10 1L19 18H1L10 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <span className="text-sm font-bold tracking-[0.05em]">DASKAPITALIST</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-xs text-white/30 font-medium tracking-wide">
                        <span className="text-white">Track Record</span>
                        <span>Streaks</span>
                        <span>Edge</span>
                        <span>Exposure</span>
                        <span className="flex items-center gap-1">Arsenal <span className="text-[8px]">+</span></span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden">
                {/* Atmospheric background image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/59c85a79b_generated_image.png)',
                            filter: 'brightness(0.3) saturate(0.4)',
                            transform: 'scale(1.05)',
                        }}
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 lg:py-48">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-3 space-y-10">
                            <div>
                                <div className="flex items-center gap-3 text-white/30 text-[10px] font-medium tracking-[0.3em] uppercase mb-6">
                                    <div className="h-px w-8 bg-white/20" />
                                    Options Intelligence
                                </div>
                                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.92] tracking-tight">
                                    First to see.
                                    <br />
                                    First to act.
                                </h1>
                            </div>

                            <p className="text-base lg:text-lg text-white/40 font-light max-w-lg leading-relaxed">
                                The market telegraphs its moves before they happen. Most traders lack the sensory apparatus to read it. DasKapitalist gives you the optics.
                            </p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/Trades')}
                                    className="group inline-flex items-center gap-3 px-8 py-3.5 border border-white/20 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/60 hover:bg-white/[0.03] transition-all"
                                >
                                    Enter platform
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-white/10 text-2xl font-thin">&gt;K</span>
                            </div>
                        </div>

                        <div className="lg:col-span-2" />
                    </div>
                </div>
            </div>

            {/* Mission strip */}
            <div className="border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
                    <div className="flex items-center justify-center gap-8 text-[9px] font-medium text-white/20 tracking-[0.25em] uppercase">
                        <span>SENSING</span>
                        <span className="text-white/5">•</span>
                        <span>ANALYSIS</span>
                        <span className="text-white/5">•</span>
                        <span>DECISION</span>
                        <span className="text-white/5">•</span>
                        <span>EXECUTION</span>
                    </div>
                </div>
            </div>

            {/* Capabilities grid */}
            <div className="px-6 lg:px-10 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="h-px w-12 bg-white/10" />
                        <span className="text-[10px] font-medium text-white/20 tracking-[0.3em] uppercase">Capabilities</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="p-10 lg:p-12 bg-black group hover:bg-white/[0.02] transition-colors">
                            <h3 className="text-xl font-light tracking-tight mb-2">Track Record</h3>
                            <div className="text-[10px] font-medium text-white/15 tracking-[0.2em] uppercase mb-4">SITUATIONAL AWARENESS</div>
                            <p className="text-sm text-white/30 leading-relaxed max-w-sm">
                                Complete operational history. Every position. Every outcome. Your financial sensor array — no blind spots.
                            </p>
                            <button onClick={() => openView('time')} className="inline-flex items-center gap-2 text-xs font-medium text-white/40 mt-6 hover:text-white/80 transition-colors">
                                View capability <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="p-10 lg:p-12 bg-black group hover:bg-white/[0.02] transition-colors">
                            <h3 className="text-xl font-light tracking-tight mb-2">Streaks</h3>
                            <div className="text-[10px] font-medium text-white/15 tracking-[0.2em] uppercase mb-4">PATTERN RECOGNITION</div>
                            <p className="text-sm text-white/30 leading-relaxed max-w-sm">
                                Temporal performance mapping. Week-over-week conviction tracking. Find the rhythm in the noise.
                            </p>
                            <button onClick={() => openView('weekly')} className="inline-flex items-center gap-2 text-xs font-medium text-white/40 mt-6 hover:text-white/80 transition-colors">
                                View capability <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="p-10 lg:p-12 bg-black group hover:bg-white/[0.02] transition-colors">
                            <h3 className="text-xl font-light tracking-tight mb-2">Edge</h3>
                            <div className="text-[10px] font-medium text-white/15 tracking-[0.2em] uppercase mb-4">TARGET ACQUISITION</div>
                            <p className="text-sm text-white/30 leading-relaxed max-w-sm">
                                Asset-level profitability matrix. Which tickers deliver alpha — and which are resource-draining distractions.
                            </p>
                            <button onClick={() => openView('ticker')} className="inline-flex items-center gap-2 text-xs font-medium text-white/40 mt-6 hover:text-white/80 transition-colors">
                                View capability <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="p-10 lg:p-12 bg-black group hover:bg-white/[0.02] transition-colors">
                            <h3 className="text-xl font-light tracking-tight mb-2">Exposure</h3>
                            <div className="text-[10px] font-medium text-white/15 tracking-[0.2em] uppercase mb-4">BATTLEFIELD VISUALIZATION</div>
                            <p className="text-sm text-white/30 leading-relaxed max-w-sm">
                                Single-glance risk topography. Everything open, sized by capital, colored by performance. Total clarity.
                            </p>
                            <button onClick={() => openView('open')} className="inline-flex items-center gap-2 text-xs font-medium text-white/40 mt-6 hover:text-white/80 transition-colors">
                                View capability <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance strip */}
            <div className="border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
                        {[
                            { value: '62.4%', label: 'Win Rate' },
                            { value: '1.83×', label: 'Profit Factor' },
                            { value: '+$47,280', label: 'Cumulative P&L' },
                            { value: '847', label: 'Missions Closed' },
                        ].map((stat, i) => (
                            <div key={i} className="py-8 flex flex-col items-center text-center">
                                <div className="text-2xl lg:text-3xl font-light tracking-tight">{stat.value}</div>
                                <div className="text-[9px] font-medium text-white/15 tracking-[0.25em] uppercase mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Arsenal section */}
            <div className="px-6 lg:px-10 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-white/10" />
                        <span className="text-[10px] font-medium text-white/20 tracking-[0.3em] uppercase">Arsenal</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-5xl font-light leading-[1.05] tracking-tight">
                                Rebuild the
                                <br />
                                arsenal.
                            </h2>
                            <p className="text-sm text-white/30 leading-relaxed max-w-md">
                                Designed for traders who operate at speed. Built with precision. Deployed in your browser. A new standard in portfolio intelligence.
                            </p>
                            <button
                                onClick={() => navigate('/Trades')}
                                className="group inline-flex items-center gap-3 px-8 py-3.5 border border-white/20 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/60 hover:bg-white/[0.03] transition-all"
                            >
                                Enter the arsenal
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            {[
                                { ticker: 'GLD', pnl: '+$14.2K', wr: '83%' },
                                { ticker: 'QQQ', pnl: '+$11.8K', wr: '71%' },
                                { ticker: 'SPY', pnl: '+$8.3K', wr: '64%' },
                                { ticker: 'TSLA', pnl: '-$4.9K', wr: '38%' },
                            ].map((row, i) => (
                                <div key={i} className="p-6 bg-black">
                                    <div className="text-lg font-light tracking-tight">{row.ticker}</div>
                                    <div className={`text-lg font-light tracking-tight mt-1 ${row.pnl.startsWith('+') ? 'text-white/60' : 'text-red-400/60'}`}>
                                        {row.pnl}
                                    </div>
                                    <div className="text-[8px] font-medium text-white/15 tracking-[0.2em] uppercase mt-2">{row.wr} win rate</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="text-white/10 text-5xl font-thin">&gt;K</div>
                        <h2 className="text-3xl lg:text-4xl font-light leading-[1.15] tracking-tight">
                            The market doesn't wait.
                            <br />
                            Neither should you.
                        </h2>
                        <p className="text-sm text-white/30 leading-relaxed">
                            Most traders are reacting. You'll be anticipating. DasKapitalist is the difference between a guess and a read.
                        </p>
                        <button
                            onClick={() => navigate('/Trades')}
                            className="group inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-white text-xs font-medium tracking-[0.15em] uppercase hover:border-white/60 hover:bg-white/[0.03] transition-all"
                        >
                            Enter platform
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-white/15">
                            <path d="M10 1L19 18H1L10 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <span className="text-[9px] font-medium text-white/10 tracking-[0.2em] uppercase">DasKapitalist</span>
                    </div>
                    <span className="text-[9px] font-medium text-white/5 tracking-[0.2em] uppercase">Designed for traders. Built for performance.</span>
                </div>
            </div>
        </div>
    );
}