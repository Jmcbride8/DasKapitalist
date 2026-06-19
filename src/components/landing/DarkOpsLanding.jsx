import React, { useState, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import AdminImage from '@/components/landing/AdminImage';
import HeroImagePicker from '@/components/landing/HeroImagePicker';
import PriceTargetText from '@/components/landing/PriceTargetText';
import ArsenalShowcase from '@/components/landing/ArsenalShowcase';

export default function DarkOpsLanding({ navigate, openView }) {
    const [time, setTime] = useState('');
    const [heroSrc, setHeroSrc] = useState('https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/9dcbd0421_ChatGPTImageJun17202603_05_42PM.png');

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
        <div className="text-white min-h-screen font-mono tracking-tight" style={{ backgroundColor: '#000000' }}>
            {/* ======== HERO ======== */}
            <section className="relative min-h-screen flex flex-col justify-end items-start px-6 lg:px-20 overflow-hidden pb-28">
                {/* Background image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <HeroImagePicker onSelect={setHeroSrc} />
                {/* Dark overlay — subtle fade */}
                {/* Desktop overlay — angled from bottom-left to top-right */}
                <div className="absolute inset-0 z-10 hidden md:block" style={{ background: 'linear-gradient(to top right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)' }} />
                {/* Mobile overlay — heavier, starts much earlier */}
                <div className="absolute inset-0 z-10 md:hidden" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,1) 85%)' }} />

                {/* Content */}
                <div className="relative z-20 max-w-4xl space-y-6">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white font-mono">
                        Beat the odds
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter">
                        <PriceTargetText>{`Know thyself.\nBuild your Edge.`}</PriceTargetText>
                    </h1>

                    <div className="h-1 w-2/3 bg-white" />

                    <p className="text-base md:text-lg text-white max-w-2xl leading-relaxed font-medium font-sans">
                        The professional's edge isn't a hot tip—it's emotional mastery and cold, hard data. We bring enterprise-grade trading analytics to everyone. Track your trades, master your mindset, and discover what actually makes you money.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => { import('@/api/base44Client').then(({ base44 }) => base44.auth.redirectToLogin('/Home')); }}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-black text-sm tracking-wider uppercase transition-all group"
                            style={{ backgroundColor: '#10b981', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                            Log In
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <a
                            href="/Dashboards?view=time"
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group"
                            style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}
                        >
                            Try the Demo
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <button
                            onClick={() => document.getElementById('darkops-arsenal').scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group"
                            style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                            See how it works
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Stock ticker at absolute bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="w-full overflow-hidden border-t border-b border-white/10 bg-black/40 backdrop-blur-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-black/60 z-10 border-r border-white/10">
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
                            <div className="flex-1 overflow-hidden relative h-14 flex items-center">
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
                                                <span className="text-white tracking-wider">{stock.symbol}</span>
                                                <span className="text-white">{stock.price}</span>
                                                <span className={`tracking-wider ${stock.up ? 'text-emerald-400' : 'text-red-400'}`}>{stock.change}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            {/* ======== POGO QUOTE (moved here) ======== */}
            <section className="py-24 px-6 lg:px-20" style={{ background: '#000' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="h-px w-16 bg-red-500/60" />
                    </div>
                    <blockquote>
                        <p className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-white mb-8">
                            "We have met the <span style={{ color: '#ef4444' }}>enemy</span>. It is us."
                        </p>
                        <cite className="text-xs font-bold tracking-[0.4em] uppercase not-italic font-mono text-white/50">
                            — Pogo, Walt Kelly
                        </cite>
                    </blockquote>
                    <div className="mt-8 flex justify-center">
                        <div className="h-px w-16 bg-red-500/60" />
                    </div>
                </div>
            </section>

            {/* ======== THE PROBLEM ======== */}
            <section className="relative py-32 px-6 lg:px-20" style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)' }}>
                <div className="max-w-[100rem]">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono">
                        EMOTIONS BEAT INTELLIGENCE
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6">
                        <PriceTargetText>{`The math is easy.\nEmotional mastery isn't.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans mb-16">
                        The pros don't have secret formulas. They have systems, discipline, and data. Here's what's actually holding you back.
                    </p>

                    {/* Problem image cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                imageKey: 'problem_1',
                                title: '⬇ Revenge Trading',
                                desc: 'You take a loss and immediately double down to get it back. The market doesn\'t care about your feelings — and neither does your account balance.',
                            },
                            {
                                imageKey: 'problem_2',
                                title: 'Overtrading',
                                desc: 'You exit winners too early and hold losers too long. You chase entries. You break your own rules. Discipline isn\'t sexy — but it\'s the only thing that compounds.',
                            },
                            {
                                imageKey: 'problem_3',
                                title: 'Capitulation',
                                desc: 'One bad week and you abandon your strategy. Fear turns a manageable drawdown into a blown account. The data would have told you to hold — if you\'d been tracking it.',
                            },
                            {
                                imageKey: 'problem_4',
                                title: 'Edge Blindness',
                                desc: 'You don\'t know which tickers actually print for you. Without per-symbol analytics, you keep feeding the losers and starving the winners.',
                            },
                        ].map((card, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-white/[0.02]">
                                <div className="relative h-80 overflow-hidden">
                                    <AdminImage
                                        imageKey={card.imageKey}
    
                                        className="w-full h-full"
                                        style={{ backgroundSize: 'cover', backgroundPosition: 'center', transform: i % 2 === 1 ? 'scaleX(-1)' : 'none' }}
                                        alt={card.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent pointer-events-none" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black mb-3 uppercase tracking-tight text-red-400">{card.title.replace('⬇ ', '')}</h3>
                                    <p className="text-sm text-white leading-relaxed font-sans">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== BUFFETT QUOTE ======== */}
            <section className="py-40 px-6 lg:px-20" style={{ background: '#000' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative">
                            <img
                                src="https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/d545f99c9_generated_image.png"
                                alt="Greek theater masks — excitement, greed, fear, sadness"
                                className="w-full rounded-2xl scale-110"
                                style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                            />
                            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 60%, rgba(10,15,20,0.6) 100%)' }} />
                        </div>
                        {/* Quote */}
                        <div>
                            <div className="mb-10 flex">
                                <div className="h-px w-16 bg-red-500/60" />
                            </div>
                            <blockquote>
                                <p className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-white mb-10">
                                    "The most important quality for an investor is{' '}
                                    <span style={{ color: '#ef4444' }}>temperament</span>,
                                    not intellect."
                                </p>
                                <cite className="text-xs font-bold tracking-[0.4em] uppercase not-italic font-mono text-white">
                                    — Warren Buffett
                                </cite>
                            </blockquote>
                            <div className="mt-10 flex">
                                <div className="h-px w-16 bg-red-500/60" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ======== KNOW YOUR LANE ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#000000' }}>
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono">
                        KNOW THYSELF
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6">
                        <PriceTargetText>{`Trading. Investing.\nSame casino, different game.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans mb-16">
                        Both can win. Both can bleed. The difference isn't the strategy — it's the honesty. Investors buy and hold, compound over decades, ignore the noise. Traders play the odds daily, grind edges, and build psychological armor. This platform is for the latter. Investors, we'll see you in Phase Two.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Investor */}
                        <div className="border rounded-2xl overflow-hidden bg-white/[0.02] flex flex-col" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                            <div className="relative h-96 overflow-hidden">
                                <AdminImage
                                    imageKey="investor_card"
                                    
                                    className="w-full h-full opacity-90"
                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    alt="Investing — long-term wealth"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#0a0f14]/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 pointer-events-none">
                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 font-mono">Phase Two</span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">

                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">The Investor</h3>
                                <p className="text-lg font-black text-white/25 uppercase tracking-tight mb-5 font-mono">Time is your edge. Patience is your weapon.</p>
                                <p className="text-sm text-white leading-relaxed font-sans mb-6">
                                    You buy quality. You wait. You compound. Decades do the heavy lifting. The casino works in your favor — if you never leave the table.
                                </p>
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {['Compound Growth', 'Buy & Hold', 'Low Touch', 'Index Tracking'].map((tag) => (
                                        <span key={tag} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/5 text-white/25">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Trader */}
                        <div className="border border-white/20 rounded-2xl overflow-hidden bg-white/[0.03] flex flex-col relative" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
                            <div className="absolute top-4 right-4 z-10">
                                <span className="text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full text-black" style={{ backgroundColor: '#10b981' }}>
                                    This Platform
                                </span>
                            </div>
                            <div className="relative h-96 overflow-hidden">
                                <AdminImage
                                    imageKey="trader_card"
                                    
                                    className="w-full h-full opacity-90"
                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    alt="Trading — the casino floor"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#0a0f14]/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">

                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">The Trader</h3>
                                <p className="text-lg font-black uppercase tracking-tight mb-5 font-mono" style={{ color: '#10b981' }}>Momentum is your edge. Discipline is your weapon.</p>
                                <p className="text-sm text-white leading-relaxed font-sans mb-6">
                                    You enter. You exit. You repeat. The casino is your arena — and the house only wins when you tilt. Know your numbers. Build your systems. <span className="text-white/70 font-semibold">Master your mind.</span>
                                </p>
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {['Win Rate Tracking', 'Risk Management', 'Emotional Mastery', 'Edge by Ticker'].map((tag) => (
                                        <span key={tag} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border text-white/40" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* ======== HOW IT WORKS ======== */}
            <section id="darkops-arsenal" className="py-32 px-6 lg:px-20" style={{ background: '#0a0a0a' }}>
                <div className="max-w-4xl ml-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono text-right">
                        THE PROCESS
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6 text-right">
                        <PriceTargetText>{`Your ritual to\nstay rational.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans ml-auto text-right mb-16">
                        From logging your first trade to finding your edge — here's how it works.
                    </p>

                    <div className="space-y-2">
                        {[
                            { step: '01', title: 'Log Your Trades', desc: 'Enter ticker, premium, collateral, and expiration. Takes 15 seconds. Bulk imports supported for the spreadsheet crowd.' },
                            { step: '02', title: 'Reflect', desc: 'Track Record, Streaks, Edge, and Exposure update instantly. No formulas. No manual P&L calculations. Ever.' },
                            { step: '03', title: 'Find Your Edge & Execute', desc: null },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-6 py-8 border-t border-white/10 first:border-t-0">
                                <span className="text-5xl font-black text-white/10 leading-none">{item.step}</span>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.title}</h3>
                                    {item.desc ? (
                                        <p className="text-sm text-white leading-relaxed font-sans">{item.desc}</p>
                                    ) : (
                                        <p className="text-sm text-white leading-relaxed font-sans">
                                            See which tickers <span style={{ color: '#10b981' }}>print</span> and which <span style={{ color: '#ef4444' }}>bleed</span>. Double down on <span style={{ color: '#10b981' }}>winners</span>. <span style={{ color: '#ef4444' }}>Cut losers</span>. Build a track record that proves you know what you're doing.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== ARSENAL ======== */}
            <ArsenalShowcase />

            {/* ======== FDR QUOTE (moved here) ======== */}
            <section className="py-24 px-6 lg:px-20" style={{ background: '#000000' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="h-px w-16 bg-white/20" />
                    </div>
                    <blockquote>
                        <p className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-white mb-8">
                            "You've got to know when to <span style={{ color: '#10b981' }}>hold 'em</span>, Know when to <span style={{ color: '#ef4444' }}>fold 'em</span>, Know when to walk away,"
                        </p>
                        <cite className="text-xs font-bold tracking-[0.4em] uppercase not-italic font-mono text-white/50">
                            — Kenny Rogers, The Gambler
                        </cite>
                    </blockquote>
                    <div className="mt-8 flex justify-center">
                        <div className="h-px w-16 bg-white/20" />
                    </div>
                </div>
            </section>

            {/* ======== FINAL CTA — Wall Street ======== */}
            <section className="relative min-h-screen flex items-center px-6 lg:px-20 overflow-hidden">
                {/* Wall Street background */}
                <AdminImage
                    imageKey="cta_bg"
                    
                    className="absolute inset-0 z-0"
                    style={{ backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(10,15,20,0.15) 50%, rgba(0,0,0,0.35) 100%)' }} />

                <div className="relative z-20 w-full max-w-7xl mx-auto">
                    <div className="mx-auto max-w-2xl text-center bg-black/50 backdrop-blur-md rounded-2xl p-10 lg:p-14 border border-white/10">
                        {/* Mission headline + CTA */}
                        <div className="flex flex-col justify-between min-h-[400px]">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter text-white">
                                    <PriceTargetText>{`Build Your\nEdge`}</PriceTargetText>
                                </h2>
                                <p className="text-base md:text-lg text-white max-w-md mx-auto leading-relaxed font-medium font-sans">
                                    Every trade logged. Every edge tracked. Every dollar accounted for. Stop guessing. Stop gambling. Start knowing. Start winning.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => { import('@/api/base44Client').then(({ base44 }) => base44.auth.redirectToLogin('/Home')); }}
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 font-black text-sm tracking-wider uppercase transition-all group rounded-md"
                                    style={{ backgroundColor: '#10b981', color: '#000' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                >
                                    Log In
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                                <a
                                    href="/Dashboards?view=time"
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group rounded-md"
                                    style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}
                                >
                                    Try the Demo
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== PRICING ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0a0a0a' }}>
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase mb-8 font-mono text-center" style={{ color: '#10b981' }}>
                        PRICING
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4 text-center text-white">
                        Get Serious.
                    </h2>
                    <p className="text-center text-white font-sans mb-16 text-base">Find Your Edge. Fight Unfair.</p>

                    <div className="grid md:grid-cols-2 gap-6 items-stretch">
                        {/* Solo */}
                        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: '560px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.6)' }}>
                            {/* Background image */}
                            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-125" style={{ backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/e03c45339_Solo3.png)' }} />
                            {/* Dark gradient overlay — heavier at bottom for text legibility */}
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 100%)' }} />
                            {/* Content */}
                            <div className="relative z-10 flex flex-col justify-end h-full p-8" style={{ minHeight: '560px' }}>
                                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 font-mono mb-2">TIER 01</p>
                                <h3 className="text-6xl font-black uppercase text-white tracking-tight mb-1">Solo</h3>
                                <div className="mb-5">
                                    <span className="text-4xl font-black text-white">$50</span>
                                    <span className="text-white/40 font-mono text-sm ml-2">/mo</span>
                                </div>
                                <p className="text-white font-sans text-sm mb-6 max-w-xs">Track every trade. Trust the data. Build your edge alone.</p>
                                <button
                                    onClick={() => navigate('/Trades')}
                                    className="w-full py-3.5 border border-white/30 text-white font-black text-sm tracking-wider uppercase hover:bg-white/10 transition-all rounded-md"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>

                        {/* AI Enabled */}
                        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: '560px', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 0 1px rgba(16,185,129,0.06), 0 8px 40px rgba(0,0,0,0.6)' }}>
                            {/* Background image */}
                            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-125" style={{ backgroundImage: 'url(https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/51af6d8d3_Sage2.png)' }} />
                            {/* Dark gradient overlay with green tint at bottom */}
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, rgba(2,20,12,0.95) 100%)' }} />
                            {/* Best value badge */}
                            <div className="absolute top-6 right-6 z-10">
                                <span className="text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full text-black" style={{ backgroundColor: '#10b981' }}>
                                    BEST VALUE
                                </span>
                            </div>
                            {/* Content */}
                            <div className="relative z-10 flex flex-col justify-end h-full p-8" style={{ minHeight: '560px' }}>
                                <p className="text-xs font-bold tracking-[0.3em] uppercase font-mono mb-2" style={{ color: 'rgba(16,185,129,0.7)' }}>TIER 02</p>
                                <h3 className="text-6xl font-black uppercase text-white tracking-tight mb-1">AI Oracle</h3>
                                <div className="mb-5">
                                    <span className="text-4xl font-black text-white">$100</span>
                                    <span className="font-mono text-sm ml-2" style={{ color: 'rgba(16,185,129,0.6)' }}>/mo</span>
                                </div>
                                <p className="text-white font-sans text-sm mb-6">Your guide on the path to mastery. Insights, patterns, and hard truths.</p>
                                <button
                                    onClick={() => navigate('/Trades')}
                                    className="w-full py-3.5 font-black text-sm tracking-wider uppercase transition-all rounded-md text-black"
                                    style={{ backgroundColor: '#10b981' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                >
                                    Enlist the Oracle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== FAQ ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0a0a0a' }}>
                <div className="max-w-3xl ml-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono text-right">
                        QUESTIONS & ANSWERS
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6 text-right">
                        <PriceTargetText>FAQ</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-16" />
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
                                <p className="text-sm text-white leading-relaxed pb-5 font-sans">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FOOTER ======== */}
            <footer className="py-12 px-6 border-t border-white/10" style={{ background: '#000000' }}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs font-black text-white/20 uppercase tracking-wider">DasKapitalist</span>
                    <span className="text-xs font-bold text-white/10 uppercase tracking-wider">Built for traders who refuse to lose.</span>
                </div>
            </footer>
        </div>
    );
}