import React from 'react';
import { ArrowRight, Circle, Grid3X3 } from 'lucide-react';

export default function SwissMinimalLanding({ navigate, openView }) {
    return (
        <div className="bg-white text-black overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="min-h-screen flex items-center px-6 lg:px-12 py-20">
                    <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-24">
                        <div className="flex flex-col justify-center">
                            <div className="space-y-10">
                                <div>
                                    <div className="h-px w-12 bg-black mb-6" />
                                    <p className="text-xs tracking-[0.3em] uppercase font-semibold text-black/30">Options Trading Analytics</p>
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-5xl lg:text-7xl font-light leading-[1.05] tracking-tight">
                                        Stop trading
                                        <br />
                                        in the dark.
                                    </h1>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-6xl lg:text-8xl font-thin">90%</span>
                                        <span className="text-xs text-black/30 max-w-[140px] leading-relaxed">of retail traders lose money. Know your numbers.</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-3 text-xs font-semibold tracking-wider uppercase hover:gap-5 transition-all group">
                                    <div className="w-10 h-px bg-black/20 group-hover:w-14 transition-all" />
                                    Enter the app
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-full aspect-square border border-black/10 grid grid-cols-2 grid-rows-2 gap-px" style={{ backgroundColor: '#FAFAFA' }}>
                                {[
                                    { value: '62.4%', label: 'Win Rate' },
                                    { value: '1.83×', label: 'Profit Factor' },
                                    { value: '+$342', label: 'Avg Trade' },
                                    { value: '+$47K', label: 'Total P&L' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFF' }}>
                                        <span className="text-3xl lg:text-4xl font-thin tracking-tight">{stat.value}</span>
                                        <span className="text-[10px] text-black/20 uppercase tracking-[0.2em] mt-2 font-semibold">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: The Problem */}
                <div className="px-6 lg:px-12 py-24 border-t border-black/5">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3">
                            <div className="h-px w-8 bg-black mb-4" />
                            <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-black/20">The Problem</span>
                        </div>
                        <div className="lg:col-span-6">
                            <h2 className="text-3xl lg:text-4xl font-light leading-[1.15] tracking-tight">
                                Your brain is not built for trading. Emotions override logic every time.
                            </h2>
                        </div>
                        <div className="lg:col-span-3">
                            <p className="text-sm leading-relaxed text-black/40">
                                The amygdala makes decisions your prefrontal cortex regrets. Without a system, you're just gambling.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section: The System */}
                <div className="px-6 lg:px-12 py-24 border-t border-black/5">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3">
                            <div className="h-px w-8 bg-black mb-4" />
                            <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-black/20">The System</span>
                        </div>
                        <div className="lg:col-span-9">
                            <div className="space-y-1">
                                {[
                                    { num: '01', name: 'Track Record', desc: 'Real P&L. Not what your broker shows.' },
                                    { num: '02', name: 'Streaks', desc: 'Every win and loss, chronologically. Find patterns.' },
                                    { num: '03', name: 'Edge', desc: 'Which tickers pay you — and which cost you.' },
                                    { num: '04', name: 'Exposure', desc: 'Everything open. One treemap. Instant clarity.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 py-6 border-b border-black/5 last:border-0 group cursor-pointer hover:bg-black/[0.01] px-2 -mx-2 transition-colors">
                                        <span className="text-lg font-thin text-black/15 w-10">{item.num}</span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <p className="text-sm text-black/30">{item.desc}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-black/10 group-hover:text-black/30 transition-colors mt-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Ticker Table */}
                <div className="px-6 lg:px-12 py-24 border-t border-black/5">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3">
                            <div className="h-px w-8 bg-black mb-4" />
                            <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-black/20">Performance</span>
                        </div>
                        <div className="lg:col-span-9">
                            <div className="border border-black/10">
                                {[
                                    { ticker: 'GLD', pnl: '+$14,200', wr: '83%', color: 'text-black' },
                                    { ticker: 'QQQ', pnl: '+$11,840', wr: '71%', color: 'text-black' },
                                    { ticker: 'SPY', pnl: '+$8,300', wr: '64%', color: 'text-black' },
                                    { ticker: 'NVDA', pnl: '+$3,100', wr: '55%', color: 'text-black/60' },
                                    { ticker: 'TSLA', pnl: '-$4,920', wr: '38%', color: 'text-red-500' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center px-6 py-4 border-b border-black/5 last:border-0">
                                        <span className="text-sm font-semibold w-16">{row.ticker}</span>
                                        <span className="text-sm font-semibold w-28">{row.pnl}</span>
                                        <span className="text-xs text-black/20 w-16">{row.wr} WR</span>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(row.wr === '83%' ? 5 : row.wr === '71%' ? 4 : row.wr === '64%' ? 3 : row.wr === '55%' ? 2 : 1)].map((_, j) => (
                                                <div key={j} className="w-2 h-2 bg-black/80" />
                                            ))}
                                            {[...Array(5 - (row.wr === '83%' ? 5 : row.wr === '71%' ? 4 : row.wr === '64%' ? 3 : row.wr === '55%' ? 2 : 1))].map((_, j) => (
                                                <div key={j} className="w-2 h-2 bg-black/10" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => openView('ticker')} className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mt-6 text-black/30 hover:text-black transition-colors">
                                View full breakdown
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="px-6 lg:px-12 py-24 border-t border-black/5">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3" />
                        <div className="lg:col-span-9">
                            <h2 className="text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-6">
                                Don't be the 90%.
                            </h2>
                            <p className="text-sm text-black/30 max-w-md mb-8 leading-relaxed">
                                Four dashboards. Zero noise. Pure edge.
                            </p>
                            <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-black/90 transition-colors group">
                                Start tracking
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 lg:px-12 py-8 border-t border-black/5">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-semibold text-black/15 tracking-[0.3em] uppercase">DasKapitalist</span>
                        <div className="flex items-center gap-6">
                            <Circle className="w-1 h-1 fill-black/10 text-black/10" />
                            <span className="text-[9px] font-semibold text-black/10 tracking-[0.3em] uppercase">Switzerland &copy; 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}