import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

export default function DarkOpsLanding({ navigate, openView }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/New_York' }) + ' ET');
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-white min-h-screen font-mono tracking-tight" style={{ backgroundColor: '#0a0f14' }}>
            {/* ======== TOP GOVERNMENT BAR ======== */}
            <div className="w-full bg-black border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 lg:px-12 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-3" viewBox="0 0 24 16" fill="none">
                            <rect width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="3" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="6" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="9" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="12" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="3" width="10" height="8" fill="#0a2463"/>
                        </svg>
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/60">An Official Platform of the Options Trader</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase font-mono">{time}</span>
                </div>
            </div>

            {/* ======== HERO ======== */}
            <section className="relative min-h-screen flex flex-col justify-center items-start px-6 lg:px-20 overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/4fa027ffb_generated_image.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Dark overlay with blue undertone */}
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(5,12,20,0.75) 50%, rgba(10,15,20,0.9) 100%)' }} />

                {/* Content */}
                <div className="relative z-20 max-w-4xl space-y-6">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white/50">
                        We Salute You
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter">
                        Join the
                        <br />
                        Market Rebellion
                    </h1>

                    <p className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed font-medium font-sans">
                        Join the multi-agency trading force dedicated to tracking every position, exposing your real edge, and keeping your portfolio strong.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate(createPageUrl('Trades'))}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-black text-sm tracking-wider uppercase transition-all group"
                            style={{ backgroundColor: '#c49a2c', color: '#000' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#d4aa3c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#c49a2c'}
                        >
                            Apply Now
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => document.getElementById('darkops-arsenal').scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group"
                            style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                            See the Arsenal
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
                        <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ======== YOUR EDGE - Ticker Carousel ======== */}
            <section className="relative py-24 px-6" style={{ background: 'linear-gradient(180deg, #0a0f14 0%, #0d131a 100%)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="h-px w-16 bg-white/30 mx-auto mb-10" />
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-center tracking-tight mb-4">
                        Your Edge
                    </h2>
                    <p className="text-sm text-white/40 text-center max-w-md mx-auto mb-16">
                        The tickers that pay. The ones that don't. Every weapon in your arsenal.
                    </p>

                    {/* Frosted glass cards row */}
                    <div className="flex gap-4 overflow-x-auto pb-4 justify-center flex-wrap">
                        {[
                            { ticker: 'GLD', winRate: '83%', pnl: '+$14,200', color: 'from-amber-500/20 to-yellow-600/20' },
                            { ticker: 'QQQ', winRate: '71%', pnl: '+$11,840', color: 'from-blue-500/20 to-indigo-600/20' },
                            { ticker: 'SPY', winRate: '64%', pnl: '+$8,300', color: 'from-green-500/20 to-emerald-600/20' },
                            { ticker: 'NVDA', winRate: '55%', pnl: '+$3,100', color: 'from-purple-500/20 to-violet-600/20' },
                            { ticker: 'XLF', winRate: '52%', pnl: '+$900', color: 'from-slate-500/20 to-gray-600/20' },
                            { ticker: 'TSLA', winRate: '38%', pnl: '-$4,920', color: 'from-red-500/20 to-rose-600/20' },
                        ].map((t) => (
                            <div
                                key={t.ticker}
                                className={`relative flex-shrink-0 w-40 h-40 rounded-2xl border border-white/10 bg-gradient-to-br ${t.color} backdrop-blur-md p-5 flex flex-col justify-between hover:border-white/30 transition-all`}
                            >
                                <div>
                                    <div className="text-lg font-black text-white">{t.ticker}</div>
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">{t.winRate} WR</div>
                                </div>
                                <div className={`text-xl font-black font-mono ${t.pnl.startsWith('+') ? 'text-white' : 'text-red-400'}`}>
                                    {t.pnl}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== TAKE CONTROL ======== */}
            <section
                className="relative py-32 px-6"
                style={{
                    background: '#0a0f14',
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(196,154,44,0.04) 0%, transparent 70%)',
                }}
            >
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tight">
                        Take
                        <br />
                        Control.
                    </h2>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        Your broker feeds you numbers. We give you a command center. Real-time exposure. Streak tracking. Edge by ticker. Everything you need to stop being the mark and start being the hunter.
                    </p>
                </div>
            </section>

            {/* ======== THREE PATHS ======== */}
            <section className="py-24 px-6" style={{ background: '#0a0f14' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="h-px w-16 bg-white/30 mx-auto mb-16" />

                    <h2 className="text-3xl md:text-4xl font-black uppercase text-center tracking-tight mb-4">
                        Every Trader Has a Path
                    </h2>
                    <p className="text-sm text-white/40 text-center max-w-lg mx-auto mb-16">
                        Whether you're grinding weekly premiums or running a multi-account operation — our dashboards adapt to how you trade.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: 'Premium Sellers',
                                desc: 'Theta gang. Weekly cash flow. Track every CSP and covered call like a P&L machine. Know exactly what you make per week.',
                            },
                            {
                                icon: Shield,
                                title: 'Portfolio Managers',
                                desc: 'Multiple accounts. Complex positions. One dashboard that shows your total exposure in a single glance. No spreadsheets.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Edge Hunters',
                                desc: 'You know your win rate on SPY. But what about TSLA vs GLD? Drill into ticker-level performance and stop trading what doesn\'t work.',
                            },
                        ].map((path, i) => {
                            const Icon = path.icon;
                            return (
                                <div key={i} className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all bg-white/[0.02]">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6 text-white/80" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">{path.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{path.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ======== HOW IT WORKS ======== */}
            <section id="darkops-arsenal" className="py-24 px-6" style={{ background: '#0d131a' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="h-px w-16 bg-white/30 mx-auto mb-16" />
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-center tracking-tight mb-4">
                        How It Works
                    </h2>
                    <p className="text-sm text-white/40 text-center max-w-md mx-auto mb-16">
                        Three steps. No fluff. Just results.
                    </p>

                    <div className="space-y-2">
                        {[
                            { step: '01', title: 'Log Your Trades', desc: 'Enter ticker, premium, collateral, and expiration. Takes 15 seconds. Bulk imports supported for the spreadsheet crowd.' },
                            { step: '02', title: 'Let the Dashboards Work', desc: 'Track Record, Streaks, Edge, and Exposure update instantly. No formulas. No manual P&L calculations. Ever.' },
                            { step: '03', title: 'Find Your Edge & Execute', desc: 'See which tickers print and which bleed. Double down on winners. Cut losers. Build a track record that proves you know what you\'re doing.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-6 py-8 border-t border-white/10 first:border-t-0">
                                <span className="text-5xl font-black text-white/10 leading-none">{item.step}</span>
                                <div>
                                    <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== ARSENAL ======== */}
            <section className="py-24 px-6" style={{ background: '#0a0f14' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="h-px w-16 bg-white/30 mx-auto mb-16" />
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-center tracking-tight mb-4">
                        Four Weapons.
                        <br />
                        Zero Excuses.
                    </h2>
                    <p className="text-sm text-white/40 text-center max-w-md mx-auto mb-16">
                        Every dashboard is built to answer one question: are you making money or not?
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                num: '01',
                                title: 'Track Record',
                                desc: 'Cumulative P&L chart. Weekly and monthly views. Win rate, profit factor, average trade. Your career as a trader — quantified.',
                                stats: [
                                    { label: 'Win Rate', value: '62%' },
                                    { label: 'Profit Factor', value: '1.8×' },
                                    { label: 'Total P&L', value: '+$47,280' },
                                ],
                            },
                            {
                                num: '02',
                                title: 'Streaks',
                                desc: 'Every week, a W or an L. Patterns your brain would miss. Current streak, best streak, worst slump — all tracked cold.',
                                stats: [
                                    { label: 'Current', value: '3 wins' },
                                    { label: 'Best Ever', value: '11 wins' },
                                    { label: 'Worst', value: '1 loss' },
                                ],
                            },
                            {
                                num: '03',
                                title: 'Edge',
                                desc: 'Your P&L broken down by ticker. Stop guessing which names make you money. See the data. Cut the losers. Ride the winners.',
                                stats: [
                                    { label: 'Top Ticker', value: 'GLD (+$14K)' },
                                    { label: 'Worst Ticker', value: 'TSLA (-$5K)' },
                                    { label: 'Total Tickers', value: '12' },
                                ],
                            },
                            {
                                num: '04',
                                title: 'Exposure',
                                desc: 'Live treemap of every open position. Size equals collateral at risk. Color by today\'s price action. One look, total clarity.',
                                stats: [
                                    { label: 'Open Positions', value: '14' },
                                    { label: 'At Risk', value: '$386K' },
                                    { label: 'Up Today', value: '9' },
                                ],
                            },
                        ].map((item) => (
                            <div key={item.num} className="border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all bg-white/[0.02]">
                                <div className="text-6xl font-black text-white/5 leading-none mb-4">{item.num}</div>
                                <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed mb-6">{item.desc}</p>
                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    {item.stats.map((s) => (
                                        <div key={s.label}>
                                            <div className="text-lg font-black text-white">{s.value}</div>
                                            <div className="text-[9px] font-bold text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FINAL CTA ======== */}
            <section
                className="relative py-40 px-6"
                style={{
                    background: '#0a0f14',
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(196,154,44,0.06) 0%, transparent 70%)',
                }}
            >
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="h-px w-16 mx-auto" style={{ backgroundColor: 'rgba(196,154,44,0.4)' }} />
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tight">
                        Start
                        <br />
                        Your Mission
                    </h2>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        Your path to beating the market starts here. Stop being a statistic. Start being the trader who knows exactly what their edge is worth.
                    </p>
                    <button
                        onClick={() => navigate(createPageUrl('Trades'))}
                        className="inline-flex items-center justify-center gap-3 px-12 py-5 font-black text-sm tracking-wider uppercase transition-all group"
                        style={{ backgroundColor: '#c49a2c', color: '#000' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#d4aa3c'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#c49a2c'}
                    >
                        Enter the Command Center
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <div className="h-px w-16 mx-auto" style={{ backgroundColor: 'rgba(196,154,44,0.4)' }} />
                </div>
            </section>

            {/* ======== FAQ ======== */}
            <section className="py-24 px-6" style={{ background: '#0d131a' }}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black uppercase text-center tracking-tight mb-16">FAQ</h2>
                    <div className="space-y-1">
                        {[
                            { q: 'What is DasKapitalist?', a: 'A precision-built options trading dashboard for traders who refuse to be part of the 90% that lose money. Track every trade, see your real edge, and build a track record that proves your skill.' },
                            { q: 'How is this different from my broker?', a: 'Your broker shows you positions. We show you who you are as a trader. Win rates by ticker. Weekly streaks. Cumulative P&L. Exposure heatmaps. Your broker doesn\'t do any of this.' },
                            { q: 'What kind of traders use this?', a: 'Options sellers running the wheel, CSP grinders, covered call farmers, and anyone managing multiple positions across multiple accounts who needs a single source of truth for performance.' },
                            { q: 'Is my data safe?', a: 'Yes. Your trade data is private to your account. We don\'t sell data, we don\'t share data. You control everything.' },
                        ].map((item, i) => (
                            <details key={i} className="group border-t border-white/10 last:border-b">
                                <summary className="flex items-center justify-between py-5 cursor-pointer">
                                    <span className="text-sm font-black text-white uppercase tracking-wider">{item.q}</span>
                                    <span className="text-white/30 text-lg transition-transform group-open:rotate-45">+</span>
                                </summary>
                                <p className="text-sm text-white/40 leading-relaxed pb-5">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FOOTER ======== */}
            <footer className="py-12 px-6 border-t border-white/10" style={{ background: '#0a0f14' }}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs font-black text-white/20 uppercase tracking-wider">DasKapitalist</span>
                    <span className="text-xs font-bold text-white/10 uppercase tracking-wider">Built for traders who refuse to lose.</span>
                </div>
            </footer>
        </div>
    );
}