import React, { useState, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import AdminImage from '@/components/landing/AdminImage';
import HeroImagePicker from '@/components/landing/HeroImagePicker';
import PriceTargetText from '@/components/landing/PriceTargetText';

export default function DarkOpsLanding({ navigate, openView }) {
    const [time, setTime] = useState('');
    const [heroSrc, setHeroSrc] = useState('https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/bb8f8b7f9_generated_image.png');

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
            {/* ======== HERO ======== */}
            <section className="relative min-h-screen flex flex-col justify-end items-start px-6 lg:px-20 overflow-hidden pb-28">
                {/* Background image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <HeroImagePicker onSelect={setHeroSrc} />
                {/* Dark overlay — subtle fade */}
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(5,12,20,0.50) 50%, rgba(10,15,20,0.75) 100%)' }} />

                {/* Content */}
                <div className="relative z-20 max-w-4xl space-y-6">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white font-mono">
                        Trade with an edge
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter">
                        <PriceTargetText>{`Be a rebel.\nBeat the odds.`}</PriceTargetText>
                    </h1>

                    <div className="h-1 w-2/3 bg-white" />

                    <p className="text-base md:text-lg text-white max-w-2xl leading-relaxed font-medium font-sans">
                        Most traders lose money — the stats don't lie. This is where you break that pattern. Track every trade, find your real edge, and build the discipline to compound your gains.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate(createPageUrl('Trades'))}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-black text-sm tracking-wider uppercase transition-all group"
                            style={{ backgroundColor: '#10b981', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                            Log In
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => navigate('/Dashboards?view=time')}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group"
                            style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}
                        >
                            Try the Demo
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
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

            {/* ======== THE PROBLEM ======== */}
            <section className="relative py-32 px-6 lg:px-20" style={{ background: 'linear-gradient(180deg, #0a0f14 0%, #0d131a 100%)' }}>
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
                                image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=600&fit=crop',
                                title: '⬇ Revenge Trading',
                                desc: 'You take a loss, then immediately size up to get it back. Trading on tilt wrecks more accounts than bad picks ever do.',
                            },
                            {
                                imageKey: 'problem_2',
                                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                                title: 'No Track Record',
                                desc: 'Without logging every trade, you have no proof you\'re any good. You can\'t refine what you don\'t measure — and most traders measure nothing.',
                            },
                            {
                                imageKey: 'problem_3',
                                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                                title: 'Confirmation Bias',
                                desc: 'You only see the setups that agree with your thesis. Your brain filters out contrary evidence, and your P&L pays the price.',
                            },
                            {
                                imageKey: 'problem_4',
                                image: 'https://images.unsplash.com/photo-1639322537228-f740dce6b4ab?w=800&h=600&fit=crop',
                                title: 'Edge Blindness',
                                desc: 'You don\'t know which tickers actually print for you. Without per-symbol analytics, you keep feeding losers and starving winners.',
                            },
                        ].map((card, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-white/[0.02]">
                                <div className="relative h-80 overflow-hidden">
                                    <AdminImage
                                        imageKey={card.imageKey}
                                        defaultSrc={card.image}
                                        className="w-full h-full"
                                        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        alt={card.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] via-transparent to-transparent pointer-events-none" />
                                </div>
                                <div className="p-8">
                                    <h3 className={`text-xl font-black mb-3 uppercase tracking-tight ${card.title.startsWith('⬇') ? 'text-red-400' : 'text-white'}`}>{card.title.replace('⬇ ', '')}</h3>
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
                                className="w-full rounded-2xl"
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
                                <cite className="text-xs font-bold tracking-[0.4em] uppercase not-italic font-mono" style={{ color: 'rgba(239,68,68,0.5)' }}>
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

            {/* ======== TAKE CONTROL ======== */}
            <section className="relative py-32 px-6 lg:px-20 overflow-hidden">
                {/* Background image */}
                <AdminImage
                    imageKey="solution_bg"
                    defaultSrc="https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/5fcd8a80e_clarity.jpg"
                    className="absolute inset-0 z-0"
                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(10,15,20,0.90) 0%, rgba(10,15,20,0.75) 40%, rgba(10,15,20,0.90) 100%)' }} />
                <div className="relative z-20 max-w-4xl ml-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono text-right">
                        THE SOLUTION
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6 text-right">
                        <PriceTargetText>{`Master\nyour Mind.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans ml-auto text-right">
                        Your broker feeds you numbers. We give you a command center. Real-time exposure. Streak tracking. Edge by ticker. Everything you need to stop being the mark and start being the hunter.
                    </p>
                </div>
            </section>

            {/* ======== KNOW YOUR LANE ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0a0f14' }}>
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
                                    defaultSrc="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&h=500&fit=crop"
                                    className="w-full h-full opacity-90"
                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    alt="Investing — long-term wealth"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 via-[#0a0f14]/20 to-transparent pointer-events-none" />
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
                                    defaultSrc="https://images.unsplash.com/photo-1598886221035-4b1e41547d04?w=800&h=500&fit=crop"
                                    className="w-full h-full opacity-90"
                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    alt="Trading — the casino floor"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 via-[#0a0f14]/20 to-transparent pointer-events-none" />
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
            <section id="darkops-arsenal" className="py-32 px-6 lg:px-20" style={{ background: '#0d131a' }}>
                <div className="max-w-4xl ml-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono text-right">
                        THE PROCESS
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6 text-right">
                        <PriceTargetText>{`Three steps.\nNo fluff.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans ml-auto text-right mb-16">
                        From logging your first trade to finding your edge — here's how it works.
                    </p>

                    <div className="space-y-2">
                        {[
                            { step: '01', title: 'Log Your Trades', desc: 'Enter ticker, premium, collateral, and expiration. Takes 15 seconds. Bulk imports supported for the spreadsheet crowd.' },
                            { step: '02', title: 'Let the Dashboards Work', desc: 'Track Record, Streaks, Edge, and Exposure update instantly. No formulas. No manual P&L calculations. Ever.' },
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
                                            See which tickers print and which <span style={{ color: '#ef4444' }}>bleed</span>. Double down on winners. <span style={{ color: '#ef4444' }}>Cut losers</span>. Build a track record that proves you know what you're doing.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== ARSENAL ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0a0f14' }}>
                <div className="">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono">
                        THE TOOLS
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6">
                        <PriceTargetText>{`Four dashboards.\nTotal clarity.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans mb-16">
                        The tools to own your numbers. Every dashboard answers one question: are your trades actually working?
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                num: '01',
                                title: 'Track Record',
                                desc: 'Cumulative P&L chart. Weekly and monthly views. Win rate, profit factor, average trade. Your career as a trader — quantified.',
                                imageKey: 'weapon_1',
                                image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop',
                                stats: [
                                    { label: 'Win Rate', value: '62%', up: true },
                                    { label: 'Profit Factor', value: '1.8×', up: true },
                                    { label: 'Total P&L', value: '+$47,280', up: true },
                                ],
                            },
                            {
                                num: '02',
                                title: 'Streaks',
                                desc: 'Every week, a W or an L. Patterns your brain would miss. Current streak, best streak, worst slump — all tracked cold.',
                                imageKey: 'weapon_2',
                                image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&h=500&fit=crop',
                                stats: [
                                    { label: 'Current', value: '3 wins', up: true },
                                    { label: 'Best Ever', value: '11 wins', up: true },
                                    { label: 'Worst', value: '1 loss', up: false },
                                ],
                            },
                            {
                                num: '03',
                                title: 'Edge',
                                desc: 'Your P&L broken down by ticker. Stop guessing which names make you money. See the data. Cut the losers. Ride the winners.',
                                imageKey: 'weapon_3',
                                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
                                stats: [
                                    { label: 'Top Ticker', value: 'GLD (+$14K)', up: true },
                                    { label: 'Worst Ticker', value: 'TSLA (-$5K)', up: false },
                                    { label: 'Total Tickers', value: '12', up: null },
                                ],
                            },
                            {
                                num: '04',
                                title: 'Exposure',
                                desc: 'Live treemap of every open position. Size equals collateral at risk. Color by today\'s price action. One look, total clarity.',
                                imageKey: 'weapon_4',
                                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
                                stats: [
                                    { label: 'Open Positions', value: '14', up: null },
                                    { label: 'At Risk', value: '$386K', up: null },
                                    { label: 'Up Today', value: '9', up: true },
                                ],
                            },
                        ].map((item) => (
                            <div key={item.num} className="group border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all bg-white/[0.02]">
                                <div className="relative h-72 overflow-hidden">
                                    <AdminImage
                                        imageKey={item.imageKey}
                                        defaultSrc={item.image}
                                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        alt={item.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute top-4 left-4 text-5xl font-black text-white/10 leading-none">{item.num}</div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">{item.title}</h3>
                                    <p className="text-sm text-white leading-relaxed font-sans mb-6">{item.desc}</p>
                                    <div className="flex gap-4 pt-4 border-t border-white/10">
                                        {item.stats.map((s) => (
                                            <div key={s.label}>
                                                <div className="flex items-center gap-1 text-lg font-black text-white">
                                                    {s.value}
                                                    {s.up === true && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                                                    {s.up === false && <TrendingDown className="w-4 h-4 text-red-400" />}
                                                </div>
                                                <div className="text-[9px] font-bold text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FINAL CTA — Wall Street ======== */}
            <section className="relative min-h-screen flex items-center px-6 lg:px-20 overflow-hidden">
                {/* Wall Street background */}
                <AdminImage
                    imageKey="cta_bg"
                    defaultSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop"
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
                                    Every trade logged. Every edge tracked. Every dollar accounted for. This is how you stop guessing and start knowing.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate(createPageUrl('Trades'))}
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 font-black text-sm tracking-wider uppercase transition-all group rounded-md"
                                    style={{ backgroundColor: '#10b981', color: '#000' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                >
                                    Log In
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                                <button
                                    onClick={() => navigate('/Dashboards?view=time')}
                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 border font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all group rounded-md"
                                    style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}
                                >
                                    Try the Demo
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== FAQ ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0d131a' }}>
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

            {/* ======== PRICING ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#0a0f14' }}>
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase mb-8 font-mono text-center" style={{ color: '#10b981' }}>
                        PRICING
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4 text-center text-white">
                        Own the numbers.
                    </h2>
                    <p className="text-center text-white font-sans mb-16 text-base">No trials. No fluff. Pick your weapon.</p>

                    <div className="grid md:grid-cols-2 gap-6 items-stretch">
                        {/* Solo */}
                        <div className="border border-white/15 rounded-2xl p-10 flex flex-col bg-white/[0.02] hover:border-white/30 transition-all">
                            <div className="mb-8">
                                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 font-mono mb-3">TIER 01</p>
                                <h3 className="text-4xl font-black uppercase text-white tracking-tight mb-2">Solo</h3>
                                <p className="text-white font-sans text-sm">For the lone wolf who tracks every trade and trusts the data.</p>
                            </div>
                            <div className="mb-10">
                                <span className="text-7xl font-black text-white">$50</span>
                                <span className="text-white/40 font-mono text-sm ml-2">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    'Unlimited trade logging',
                                    'Track Record dashboard',
                                    'Streaks & win rate tracking',
                                    'Edge by ticker analytics',
                                    'Live exposure treemap',
                                    'Multi-account support',
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-white font-sans">
                                        <span className="w-5 h-5 flex-shrink-0 rounded-full border border-white/20 flex items-center justify-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/Trades')}
                                className="w-full py-4 border border-white/20 text-white font-black text-sm tracking-wider uppercase hover:bg-white/5 transition-all rounded-md"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* AI Enabled */}
                        <div className="rounded-2xl p-10 flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2010 0%, #0a1a0d 100%)', border: '1px solid rgba(16,185,129,0.4)' }}>
                            {/* Glow */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
                            <div className="absolute top-6 right-6">
                                <span className="text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full text-black" style={{ backgroundColor: '#10b981' }}>
                                    BEST VALUE
                                </span>
                            </div>
                            <div className="mb-8 relative z-10">
                                <p className="text-xs font-bold tracking-[0.3em] uppercase font-mono mb-3" style={{ color: 'rgba(16,185,129,0.5)' }}>TIER 02</p>
                                <h3 className="text-4xl font-black uppercase text-white tracking-tight mb-2">AI Enabled</h3>
                                <p className="text-white font-sans text-sm">Bring an AI co-pilot to the table. Pattern recognition. Trade insights. Ruthless objectivity.</p>
                            </div>
                            <div className="mb-10 relative z-10">
                                <span className="text-7xl font-black text-white">$100</span>
                                <span className="font-mono text-sm ml-2" style={{ color: 'rgba(16,185,129,0.5)' }}>/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                {[
                                    'Everything in Solo',
                                    'AI trade pattern analysis',
                                    'Behavioral bias detection',
                                    'Weekly AI performance debrief',
                                    'Natural language trade search',
                                    'Priority support',
                                ].map((feature, i) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-white font-sans">
                                        <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(16,185,129,0.4)' }}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                                        </span>
                                        {i === 0 ? <span className="font-bold">{feature}</span> : feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/Trades')}
                                className="w-full py-4 font-black text-sm tracking-wider uppercase transition-all rounded-md relative z-10 text-black"
                                style={{ backgroundColor: '#10b981' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                            >
                                Go AI
                            </button>
                        </div>
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