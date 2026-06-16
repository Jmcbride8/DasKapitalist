import React from 'react';
import { ArrowRight, Hammer, AlertTriangle } from 'lucide-react';

export default function ConstructivistLanding({ navigate, openView }) {
    return (
        <div className="text-black overflow-x-hidden" style={{ backgroundColor: '#EAE4D3', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="min-h-screen relative flex flex-col justify-center px-6 lg:px-12 py-20">
                    {/* Diagonal background element */}
                    <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block" style={{
                        background: 'linear-gradient(135deg, transparent 0%, #C41E1E 100%)',
                        opacity: 0.08,
                        clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)',
                    }} />

                    <div className="relative space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#C41E1E] flex items-center justify-center">
                                <Hammer className="w-5 h-5 text-[#EAE4D3]" />
                            </div>
                            <span className="text-[10px] font-black text-black/30 tracking-[0.3em] uppercase">
                                Workers of Capital, Unite!
                            </span>
                        </div>

                        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tight uppercase">
                            Seize the
                            <br />
                            means of
                            <br />
                            <span className="text-[#C41E1E]">profit.</span>
                        </h1>

                        <div className="max-w-lg space-y-4">
                            <p className="text-base text-black/50 leading-relaxed">
                                The brokerage class profits from your losses. Their platform is designed to keep you trading, not winning. DasKapitalist is the people's analytics — your data, your edge, your revolution.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-2 px-8 py-4 bg-[#C41E1E] text-[#EAE4D3] font-black text-xs tracking-wider uppercase hover:bg-[#A01818] transition-colors group">
                                Join the revolution
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom stats bar */}
                    <div className="mt-20 border-t-4 border-black pt-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { value: '62.4%', label: 'Win Rate' },
                                { value: '1.83×', label: 'Profit Factor' },
                                { value: '+$47,280', label: 'Total Gain' },
                                { value: '847', label: 'Trades Closed' },
                            ].map((stat, i) => (
                                <div key={i} className="border-l-4 border-[#C41E1E] pl-4">
                                    <div className="text-3xl lg:text-4xl font-black tracking-tight">{stat.value}</div>
                                    <div className="text-[9px] font-black text-black/25 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section: The Oppression */}
                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-[#EAE4D3] text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                                <AlertTriangle className="w-3 h-3" />
                                They profit from your failure
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.95] tracking-tight mb-6">
                                The brokerage
                                <br />
                                apparatus
                            </h2>
                            <p className="text-sm text-black/40 leading-relaxed max-w-md">
                                Their interface is addictive. Their charts are designed to trigger dopamine. Their order flow is sold to the highest bidder. You are not the customer — you are the product.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                'Broker sells your order flow to hedge funds',
                                'Flashy UI encourages overtrading',
                                'No native P&L tracking across strategies',
                                'Gamification rewards frequency over quality',
                                'Your data stays locked in their silo',
                            ].map((point, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 border-l-4 border-[#C41E1E] bg-black/[0.02]">
                                    <span className="text-[#C41E1E] font-black text-sm">0{i+1}</span>
                                    <span className="text-sm font-bold text-black/70">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section: The Arsenal */}
                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.95] tracking-tight mb-12">
                        Weapons of
                        <br />
                        class warfare
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {[
                            { num: '01', title: 'Track Record', desc: 'Your complete financial history. Every trade, every outcome, every mistake — rendered in black and red.' },
                            { num: '02', title: 'Streaks', desc: 'The rhythm of your returns. Weekly cadence reveals what memory erases: your actual patterns of success and failure.' },
                            { num: '03', title: 'Edge Analysis', desc: 'Capitalist efficiency applied to your portfolio. Cut the tickers that drain you. Double down on what works.' },
                            { num: '04', title: 'Exposure Map', desc: 'A single visualization of everything at risk. Size equals capital. Color equals performance. One glance, total clarity.' },
                        ].map((item, i) => (
                            <div key={i} className="border-2 border-black p-8 hover:bg-black hover:text-[#EAE4D3] transition-colors group">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-5xl font-black text-[#C41E1E] group-hover:text-[#EAE4D3]">{item.num}</span>
                                    <div className="w-12 h-px bg-[#C41E1E] group-hover:bg-[#EAE4D3]" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{item.title}</h3>
                                <p className="text-sm text-black/40 group-hover:text-[#EAE4D3]/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: The Comrades */}
                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.95] tracking-tight mb-12">
                        The people's
                        <br />
                        portfolio
                    </h2>

                    <div>
                        {[
                            { ticker: 'GLD', pnl: '+$14,200', wr: '83%', tag: 'VANGUARD' },
                            { ticker: 'QQQ', pnl: '+$11,840', wr: '71%', tag: 'SOLID' },
                            { ticker: 'SPY', pnl: '+$8,300', wr: '64%', tag: 'RELIABLE' },
                            { ticker: 'NVDA', pnl: '+$3,100', wr: '55%', tag: 'WATCH' },
                            { ticker: 'TSLA', pnl: '-$4,920', wr: '38%', tag: 'LIQUIDATE' },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center px-6 py-4 border-b-2 border-black/10 last:border-0">
                                <span className="text-sm font-black uppercase w-16">{row.ticker}</span>
                                <span className={`text-sm font-black w-28 ${row.pnl.startsWith('+') ? 'text-black' : 'text-[#C41E1E]'}`}>{row.pnl}</span>
                                <span className="text-xs font-bold text-black/20 w-16">{row.wr} WR</span>
                                <span className={`ml-auto text-[9px] font-black tracking-[0.15em] uppercase px-3 py-1 border-2 ${row.tag === 'LIQUIDATE' ? 'border-[#C41E1E] text-[#C41E1E]' : 'border-black/20 text-black/30'}`}>
                                    {row.tag}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => openView('ticker')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-8 text-[#C41E1E] hover:text-black transition-colors">
                        Analyze the masses
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* CTA */}
                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <div className="max-w-2xl">
                        <div className="w-16 h-2 bg-[#C41E1E] mb-8" />
                        <h2 className="text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-6">
                            Seize your
                            <br />
                            <span className="text-[#C41E1E]">financial power.</span>
                        </h2>
                        <p className="text-sm text-black/40 max-w-md mb-10 leading-relaxed">
                            The revolution will not be televised. It will be tracked, analyzed, and optimized — one trade at a time.
                        </p>
                        <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-3 px-10 py-5 bg-[#C41E1E] text-[#EAE4D3] font-black text-xs tracking-wider uppercase hover:bg-black transition-colors group">
                            Begin the revolution
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 lg:px-12 py-8 border-t-2 border-black flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#C41E1E] flex items-center justify-center">
                            <Hammer className="w-3 h-3 text-[#EAE4D3]" />
                        </div>
                        <span className="text-[9px] font-black text-black/20 tracking-[0.3em] uppercase">DasKapitalist</span>
                    </div>
                    <span className="text-[9px] font-black text-black/10 tracking-[0.3em] uppercase">For the traders. By the traders.</span>
                </div>
            </div>
        </div>
    );
}