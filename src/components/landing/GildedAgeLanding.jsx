import React from 'react';
import { ArrowRight, Crown, Sparkles } from 'lucide-react';

export default function GildedAgeLanding({ navigate, openView }) {
    return (
        <div className="text-[#D4B87A] overflow-x-hidden" style={{ backgroundColor: '#0A1628', fontFamily: "'Playfair Display', Georgia, serif" }}>
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="min-h-screen flex flex-col justify-center px-6 lg:px-12 py-20">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-16 bg-[#D4B87A]/30" />
                            <Crown className="w-4 h-4 text-[#D4B87A]/40" />
                            <span className="text-[9px] tracking-[0.4em] uppercase text-[#D4B87A]/40 font-sans font-bold">Private Client</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                The house
                                <br />
                                always wins.
                                <br />
                                <span className="text-white font-bold italic">Unless you own it.</span>
                            </h1>
                            <p className="text-lg text-[#D4B87A]/50 font-sans font-light max-w-xl leading-relaxed">
                                DasKapitalist is the private ledger for traders who understand that information is the ultimate asset class.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-3 px-10 py-4 border border-[#D4B87A] text-[#D4B87A] font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#D4B87A] hover:text-[#0A1628] transition-all group">
                                Enter the study
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px border border-[#D4B87A]/10">
                        {[
                            { value: '62.4%', label: 'Win Ratio' },
                            { value: '1.83×', label: 'Profit Factor' },
                            { value: '+$47,280', label: 'Cumulative Return' },
                            { value: '847', label: 'Transactions Closed' },
                        ].map((stat, i) => (
                            <div key={i} className="p-8 border border-[#D4B87A]/10 text-center" style={{ backgroundColor: 'rgba(212,184,122,0.03)' }}>
                                <div className="text-3xl lg:text-4xl tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stat.value}</div>
                                <div className="text-[8px] tracking-[0.3em] uppercase text-[#D4B87A]/25 font-sans font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Philosophy */}
                <div className="px-6 lg:px-12 py-24 border-t border-[#D4B87A]/5">
                    <div className="max-w-3xl">
                        <div className="h-px w-24 bg-[#D4B87A]/20 mb-8" />
                        <h2 className="text-3xl lg:text-4xl leading-[1.2] tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Most traders are ruined not by the market, but by their own temperament.
                        </h2>
                        <p className="text-[#D4B87A]/40 font-sans font-light leading-relaxed max-w-xl">
                            Panic sells. Euphoria buys. Greed holds too long. Fear closes too soon. DasKapitalist is the dispassionate observer — your second self that remembers every trade, every pattern, every costly impulse.
                        </p>
                    </div>
                </div>

                {/* Section: The Four Instruments */}
                <div className="px-6 lg:px-12 py-24 border-t border-[#D4B87A]/5">
                    <div className="h-px w-24 bg-[#D4B87A]/20 mb-12" />
                    <h2 className="text-3xl lg:text-4xl tracking-tight mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        The four instruments
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {[
                            { numeral: 'I', title: 'Track Record', desc: 'The complete ledger. Every position, every outcome. Your financial biography rendered in precise, unforgiving detail.' },
                            { numeral: 'II', title: 'Streaks', desc: 'The chronology of conviction. Week by week, a record of when your judgment was sound — and when it failed you.' },
                            { numeral: 'III', title: 'Edge', desc: 'The differential analysis. Which assets reward your attention, and which ones are merely expensive distractions.' },
                            { numeral: 'IV', title: 'Exposure', desc: 'The treemap of vulnerability. A single view of everything at risk, sized by capital, shaded by performance.' },
                        ].map((item, i) => (
                            <div key={i} className="border border-[#D4B87A]/10 p-8" style={{ backgroundColor: 'rgba(212,184,122,0.02)' }}>
                                <span className="text-5xl text-[#D4B87A]/15 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.numeral}</span>
                                <h3 className="text-xl mt-4 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h3>
                                <p className="text-sm text-[#D4B87A]/40 font-sans font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Holdings */}
                <div className="px-6 lg:px-12 py-24 border-t border-[#D4B87A]/5">
                    <div className="h-px w-24 bg-[#D4B87A]/20 mb-12" />
                    <h2 className="text-3xl lg:text-4xl tracking-tight mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Current holdings
                    </h2>

                    <div className="border border-[#D4B87A]/10">
                        {[
                            { ticker: 'Gold Trust', symbol: 'GLD', pnl: '+$14,200', wr: '83%', rating: 'Exceptional' },
                            { ticker: 'Nasdaq 100', symbol: 'QQQ', pnl: '+$11,840', wr: '71%', rating: 'Excellent' },
                            { ticker: 'S&P 500', symbol: 'SPY', pnl: '+$8,300', wr: '64%', rating: 'Strong' },
                            { ticker: 'NVIDIA Corp', symbol: 'NVDA', pnl: '+$3,100', wr: '55%', rating: 'Adequate' },
                            { ticker: 'Tesla Inc', symbol: 'TSLA', pnl: '-$4,920', wr: '38%', rating: 'Divest' },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center px-8 py-5 border-b border-[#D4B87A]/5 last:border-0 hover:bg-[#D4B87A]/[0.02] transition-colors">
                                <div className="w-20">
                                    <div className="text-sm tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{row.symbol}</div>
                                    <div className="text-[9px] text-[#D4B87A]/20 font-sans font-light mt-0.5">{row.ticker}</div>
                                </div>
                                <span className={`text-sm font-sans font-bold w-28 ${row.pnl.startsWith('+') ? 'text-[#D4B87A]' : 'text-red-400'}`}>{row.pnl}</span>
                                <span className="text-xs text-[#D4B87A]/20 font-sans w-16">{row.wr} WR</span>
                                <span className={`text-[9px] font-sans font-bold tracking-[0.15em] uppercase ml-auto px-3 py-1 border ${row.rating === 'Divest' ? 'border-red-400/30 text-red-400' : 'border-[#D4B87A]/20 text-[#D4B87A]/40'}`}>
                                    {row.rating}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="px-6 lg:px-12 py-24 border-t border-[#D4B87A]/5 text-center">
                    <Sparkles className="w-8 h-8 text-[#D4B87A]/30 mx-auto mb-6" />
                    <h2 className="text-4xl lg:text-5xl tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Take your seat at the table.
                    </h2>
                    <p className="text-[#D4B87A]/40 font-sans font-light mb-10 max-w-md mx-auto leading-relaxed">
                        Most traders are speculating. You will be calculating.
                    </p>
                    <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-3 px-12 py-5 border border-[#D4B87A] text-[#D4B87A] font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#D4B87A] hover:text-[#0A1628] transition-all group">
                        Begin your ledger
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 lg:px-12 py-8 border-t border-[#D4B87A]/5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Crown className="w-3 h-3 text-[#D4B87A]/20" />
                            <span className="text-[9px] font-sans font-bold text-[#D4B87A]/15 tracking-[0.3em] uppercase">DasKapitalist</span>
                        </div>
                        <span className="text-[9px] font-sans font-light text-[#D4B87A]/10 tracking-[0.3em] uppercase">Est. 2024 — Private Wealth Management Tools</span>
                    </div>
                </div>
            </div>
        </div>
    );
}