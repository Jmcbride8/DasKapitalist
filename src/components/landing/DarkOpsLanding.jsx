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
            {/* ======== TOP TICKER BAR ======== */}
            <div className="w-full bg-black border-b border-white/10 overflow-hidden">
                <div className="flex items-center">
                    {/* Flag + time fixed left */}
                    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-1.5 bg-black z-10 border-r border-white/10">
                        <svg className="w-4 h-3" viewBox="0 0 24 16" fill="none">
                            <rect width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="3" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="6" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="9" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="12" width="24" height="2" fill="white" opacity="0.8"/>
                            <rect y="3" width="10" height="8" fill="#0a2463"/>
                        </svg>
                        <span className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase font-mono whitespace-nowrap">{time}</span>
                    </div>
                    {/* Scrolling ticker */}
                    <div className="flex-1 overflow-hidden relative h-7 flex items-center">
                        <div className="flex gap-10 whitespace-nowrap animate-ticker">
                            {(() => {
                                const stocks = [
                                    { symbol: 'SPX', price: '5,472.30', change: '+0.84%', up: true },
                                    { symbol: 'NDX', price: '19,756.12', change: '+1.12%', up: true },
                                    { symbol: 'DJI', price: '38,647.50', change: '-0.23%', up: false },
                                    { symbol: 'VIX', price: '14.82', change: '-2.18%', up: true },
                                    { symbol: 'GLD', price: '218.45', change: '+0.67%', up: true },
                                    { symbol: 'SPY', price: '547.10', change: '+0.81%', up: true },
                                    { symbol: 'QQQ', price: '482.33', change: '+1.08%', up: true },
                                    { symbol: 'NVDA', price: '128.44', change: '+2.31%', up: true },
                                    { symbol: 'TSLA', price: '187.62', change: '-1.45%', up: false },
                                    { symbol: 'IWM', price: '209.87', change: '-0.56%', up: false },
                                    { symbol: 'TLT', price: '92.14', change: '+0.18%', up: true },
                                    { symbol: 'USO', price: '72.40', change: '+1.93%', up: true },
                                ];
                                const doubled = [...stocks, ...stocks];
                                return doubled.map((stock, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold font-mono">
                                        <span className="text-white/80 tracking-wider">{stock.symbol}</span>
                                        <span className="text-white/60">{stock.price}</span>
                                        <span className={`tracking-wider ${stock.up ? 'text-emerald-400' : 'text-red-400'}`}>{stock.change}</span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
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
                {/* Dark overlay — subtle fade */}
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(5,12,20,0.50) 50%, rgba(10,15,20,0.75) 100%)' }} />

                {/* Content */}
                <div className="relative z-20 max-w-4xl space-y-6">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white/80">
                        Don't be average
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter">
                        Be a rebel.
                        <br />
                        Beat the odds.
                    </h1>

                    <p className="text-base md:text-lg text-white max-w-xl leading-relaxed font-medium font-sans">
                        Most traders lose money — the stats don't lie. This is the platform to build psychological immunity: the tools to track your performance, manage your psychology, and win.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate(createPageUrl('Trades'))}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-black text-sm tracking-wider uppercase transition-all group"
                            style={{ backgroundColor: '#c49a2c', color: '#000' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#d4aa3c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#c49a2c'}
                        >
                            Log In
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => document.getElementById('darkops-arsenal').scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group"
                            style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                            The weapons to win
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

            {/* ======== THE PROBLEM ======== */}
            <section className="relative py-24 px-6" style={{ background: 'linear-gradient(180deg, #0a0f14 0%, #0d131a 100%)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="h-px w-16 bg-white/30 mx-auto mb-10" />
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-center tracking-tight mb-4">
                        The Problem
                    </h2>
                    <p className="text-sm text-white/40 text-center max-w-md mx-auto mb-16">
                        Day trading is designed to break you. Here's what you're up against — and how we fix it.
                    </p>

                    {/* Problem image cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
                                title: 'Emotional Decisions',
                                desc: 'Fear and greed destroy more accounts than bad analysis. Your brain is wired to buy tops and sell bottoms.',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
                                title: 'No Performance Data',
                                desc: 'Without tracking every trade, you can\'t improve what you can\'t measure. Most traders don\'t even know their win rate.',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                                title: 'Information Overload',
                                desc: 'Too many indicators, no clarity. You drown in data but starve for insight on what actually makes you money.',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1633158829585-23ba4f03a014?w=600&h=400&fit=crop',
                                title: 'No Edge Awareness',
                                desc: 'Trading tickers without knowing your win rate per symbol. You keep trading losers and cutting winners too early.',
                            },
                        ].map((card, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-white/[0.02]">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ filter: 'grayscale(100%) brightness(0.6)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] via-transparent to-transparent" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-base font-black text-white mb-2 uppercase tracking-tight">{card.title}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
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

            {/* ======== FINAL CTA — Wall Street ======== */}
            <section className="relative min-h-[90vh] flex items-center px-6 lg:px-20 overflow-hidden">
                {/* Wall Street background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/370ef799f_generated_image.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                />
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(10,15,20,0.30) 50%, rgba(0,0,0,0.50) 100%)' }} />

                <div className="relative z-20 w-full max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-end">
                        {/* LEFT: How It Works */}
                        <div className="space-y-8">
                            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/50 font-mono">
                                How It Works
                            </p>
                            <div className="space-y-10">
                                {[
                                    { step: '01', title: 'Log your trades', desc: 'Enter ticker, premium, collateral, and expiration. Under 15 seconds per trade. Bulk imports for the spreadsheet crowd.' },
                                    { step: '02', title: 'Find your edge', desc: 'Dashboards auto-calculate your real win rate, profit factor, and P&L broken down by ticker. No formulas. No spreadsheets.' },
                                    { step: '03', title: 'Execute with confidence', desc: 'Double down on what works. Cut what bleeds. Trade with a track record that proves you know exactly what you\'re doing.' },
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-5">
                                        <span className="text-sm font-black text-white/15 leading-none pt-0.5">{item.step}</span>
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-sm text-white/50 leading-relaxed mt-1 font-sans">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Mission headline + CTA */}
                        <div className="flex flex-col justify-between min-h-[400px]">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                                    Start Your
                                    <br />
                                    Mission
                                </h2>
                                <p className="text-base md:text-lg text-white/60 max-w-md leading-relaxed font-sans">
                                    Your path to trading mastery starts here. Log your trades, find your edge, and build the discipline to beat the market consistently.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(createPageUrl('Trades'))}
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 font-black text-sm tracking-wider uppercase transition-all group self-start rounded-md"
                                style={{ backgroundColor: '#F7D147', color: '#000' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#FDE68A'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#F7D147'}
                            >
                                Log In
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
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