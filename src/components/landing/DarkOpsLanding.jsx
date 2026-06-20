import React, { useState, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import AdminImage from '@/components/landing/AdminImage';
import HeroImagePicker from '@/components/landing/HeroImagePicker';
import PriceTargetText from '@/components/landing/PriceTargetText';
import ArsenalShowcase from '@/components/landing/ArsenalShowcase';
import ProblemsShowcase from '@/components/landing/ProblemsShowcase';
import PricingShowcase from '@/components/landing/PricingShowcase';

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
                <div className="relative z-20 max-w-4xl space-y-6 pt-16 md:pt-0">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white font-mono">
                        Focus. Win.
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter">
                        <PriceTargetText>{`Know thyself.\nBuild your Edge.`}</PriceTargetText>
                    </h1>

                    <div className="h-1 w-2/3 bg-white" />

                    <p className="text-base md:text-lg text-white max-w-2xl leading-relaxed font-medium font-sans">
                        Speed and complexity aren't your edge.<br />Clarity is.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => { import('@/api/base44Client').then(({ base44 }) => base44.auth.redirectToLogin('/Home')); }}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-black text-sm tracking-wider uppercase transition-all group"
                            style={{ backgroundColor: '#10b981', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                            Lock In
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
            <ProblemsShowcase />

            {/* ======== BUFFETT QUOTE ======== */}
            <section className="py-12 md:py-40 px-6 lg:px-20" style={{ background: '#000' }}>
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
                        KNOW THE GAME
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6">
                        <PriceTargetText>{`TRADING. INVESTING.\nSAME MARKET. DIFFERENT GAME.`}</PriceTargetText>
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
            <section id="darkops-arsenal" className="py-32 px-6 lg:px-20" style={{ background: '#050505' }}>
                <div className="max-w-4xl ml-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-8 font-mono text-right">
                        THE PROCESS
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-6 text-right">
                        <PriceTargetText>{`Your ritual to\nstay rational.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10 mb-8" />
                    <p className="text-base text-white max-w-xl leading-relaxed font-medium font-sans ml-auto text-right mb-16">
                        The market triggers greed, fear, and overconfidence — but rewards discipline. Discipline begins with reflection. Log your trades. Build the habit. Breathe. Speed isn't your edge. Objectivity is.
                    </p>

                    <div className="space-y-2">
                        {[
                            { step: '01', title: 'Log Your Trades', desc: 'The market closes. Your work begins. Log every trade and build your discipline.' },
                            { step: '02', title: 'Reflect', desc: 'Insight begins with reflection. Review your Track Record, Streaks, Edge, and Exposure. Breathe. Let the data speak.' },
                            { step: '03', title: 'Evolve', desc: null },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 py-8 border-t border-white/10 first:border-t-0">
                                <span className="text-6xl md:text-8xl font-black text-white/10 leading-none">{item.step}</span>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.title}</h3>
                                    {item.desc ? (
                                        <p className="text-sm text-white leading-relaxed font-sans">{item.desc}</p>
                                    ) : (
                                        <p className="text-sm text-white leading-relaxed font-sans">
                                            Know what's working. Know what isn't. Press your edge. Cut your losers. Trade from <span style={{ color: '#10b981' }}>evidence</span>, not <span style={{ color: '#ef4444' }}>emotion</span>.
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
            <section className="py-24 px-4 md:px-6 lg:px-20" style={{ background: '#000000' }}>
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

            {/* ======== PRICING ======== */}
            <PricingShowcase onNavigate={navigate} />

            {/* ======== FINAL CTA — Wall Street ======== */}
            <section className="relative min-h-screen flex items-center px-6 lg:px-20 overflow-hidden">
                <img
                    src="https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/57544f7d6_generated_image.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(10,15,20,0.15) 50%, rgba(0,0,0,0.35) 100%)' }} />

                <div className="relative z-20 w-full max-w-7xl mx-auto">
                    <div className="mx-auto max-w-2xl text-center bg-black/50 backdrop-blur-md rounded-2xl p-10 lg:p-14 border border-white/10">
                        <div className="flex flex-col justify-between min-h-[400px]">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tighter text-white">
                                    <PriceTargetText>{`Lock in.`}</PriceTargetText>
                                </h2>
                                <p className="text-base md:text-lg text-white max-w-md mx-auto leading-relaxed font-medium font-sans">
                                    Every trade logged. Stop guessing. Stop gambling. Start knowing. Start winning.
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

            {/* ======== FAQ ======== */}
            <section className="py-32 px-6 lg:px-20" style={{ background: '#050505' }}>
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