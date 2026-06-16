import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, Flame, Brain, Layers, ArrowRight, LineChart, Target } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
            {/* Grain overlay */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none" />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center">
                {/* Background glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[180px]" />
                <div className="absolute top-1/4 right-0 w-[400px] h-[500px] bg-teal-500/8 rounded-full blur-[140px]" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Left: Copy */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-medium text-white/60 tracking-wider uppercase">
                                    Personal Trading Analytics
                                </span>
                            </div>

                            <div className="space-y-5">
                                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
                                    <span className="text-white">Know your</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-300 via-teal-400 to-emerald-200 bg-clip-text text-transparent">
                                        edge.
                                    </span>
                                </h1>
                                <p className="text-lg lg:text-xl text-white/40 max-w-md leading-relaxed">
                                    The only portfolio tracker built for options traders.
                                    See your real performance, not what your broker shows you.
                                </p>
                            </div>

                            {/* Stats row */}
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-2xl font-bold text-white">100%</div>
                                    <div className="text-xs text-white/30 mt-1">Free to start</div>
                                </div>
                                <div className="w-px bg-white/10" />
                                <div>
                                    <div className="text-2xl font-bold text-white">7+</div>
                                    <div className="text-xs text-white/30 mt-1">Option strategies</div>
                                </div>
                                <div className="w-px bg-white/10" />
                                <div>
                                    <div className="text-2xl font-bold text-white">4</div>
                                    <div className="text-xs text-white/30 mt-1">Live dashboards</div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={() => navigate(createPageUrl('Trades'))}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-all hover:gap-3 group"
                                >
                                    Launch App
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </button>
                                <button
                                    onClick={() => navigate(createPageUrl('Dashboards'))}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white rounded-xl font-medium text-sm hover:bg-white/[0.04] transition-all"
                                >
                                    View Dashboards
                                </button>
                            </div>
                        </div>

                        {/* Right: App Mockup */}
                        <div className="relative">
                            {/* Floating glow behind card */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent rounded-3xl blur-2xl" />

                            {/* Desktop mockup frame */}
                            <div className="relative rounded-2xl border border-white/10 bg-[#111113] shadow-2xl shadow-black/50 overflow-hidden">
                                {/* Title bar */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0d0d0f]">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-[#1a1a1c] rounded-md px-4 py-1.5 text-xs text-white/25 text-center truncate">
                                            DasKapitalist — Today's Exposure
                                        </div>
                                    </div>
                                </div>

                                {/* App screenshot */}
                                <div className="relative">
                                    <img
                                        src="https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/62285c536_generated_image.png"
                                        alt="DasKapitalist portfolio dashboard showing position treemap, exposure summary, and trading analytics"
                                        className="w-full h-auto"
                                        style={{ maxHeight: '420px', objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                    {/* Gradient fade at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111113] to-transparent" />
                                </div>
                            </div>

                            {/* Floating accent */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Thesis */}
            <section className="relative border-t border-white/[0.04] bg-[#0d0d0f] overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-rose-500/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-28 relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-rose-400" />
                        </div>
                        <span className="text-xs font-medium text-rose-400/80 tracking-wider uppercase">The Problem</span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                        Your reptile brain is<br />
                        <span className="text-white/30">your worst enemy.</span>
                    </h2>

                    <div className="space-y-5 text-white/35 text-base lg:text-lg leading-relaxed max-w-3xl">
                        <p>
                            When you're staring at a red day, your amygdala—the same part of your brain
                            that once kept you alive by spotting predators—takes over. Logic shuts down.
                            You close positions too early. You let losers run. You revenge-trade. You break
                            every rule you set for yourself.
                        </p>
                        <p>
                            This isn't speculation. <span className="text-white/50">Studies consistently show that 80-90% of day traders
                            lose money over time.</span> Not because they're stupid. Not because they don't understand
                            the market. Because they can't regulate the emotional response to watching their
                            money move in real-time.
                        </p>
                        <p>
                            The traders who win aren't the ones who feel nothing. They're the ones who built a
                            system that gives them <span className="text-white/50">perspective when their brain is screaming panic.</span>
                        </p>
                    </div>

                    <div className="mt-10 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                        <p className="text-sm text-white/25 italic leading-relaxed">
                            &ldquo;The market is a device for transferring money from the impatient to the patient.&rdquo;
                            <span className="block mt-1 text-white/15 not-italic">— Warren Buffett</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Views */}
            <section className="relative bg-[#0a0a0b] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28">
                    <div className="text-center mb-20">
                        <span className="text-xs font-medium text-emerald-400/70 tracking-wider uppercase">The System</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3 mb-4">
                            Four views. One truth.
                        </h2>
                        <p className="text-white/25 text-base max-w-lg mx-auto">
                            Each dashboard is designed to answer one critical question your
                            brokerage app never will.
                        </p>
                    </div>

                    <div className="space-y-20">
                        {/* Track Record */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                    <LineChart className="w-5 h-5 text-sky-400" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white">Track Record</h3>
                                <div className="space-y-4 text-white/30 text-sm lg:text-base leading-relaxed">
                                    <p>
                                        Your cumulative P&L, broken down by ticker, strategy, and time. Not your
                                        broker's sanitized &ldquo;total return&rdquo;—your actual performance history.
                                    </p>
                                    <p className="text-white/20">
                                        <span className="text-white/40 font-medium">Why it matters emotionally:</span> When
                                        you're down on the week and feel like quitting, the Track Record reminds you
                                        that your long-term trend is up. When you're euphoric after a win streak, it
                                        grounds you in the data. It replaces feelings with facts.
                                    </p>
                                </div>
                            </div>
                            <div className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d0f] p-1 overflow-hidden">
                                <div className="relative rounded-xl bg-gradient-to-br from-sky-950/40 to-[#0d0d0f] p-8 lg:p-12">
                                    <div className="space-y-3">
                                        <div className="flex items-end gap-2">
                                            <div className="text-4xl font-bold text-white">+$47,280</div>
                                            <div className="text-sm text-sky-400/70 pb-1">cumulative P&L</div>
                                        </div>
                                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: '72%' }} />
                                        </div>
                                        <div className="flex justify-between text-xs text-white/15">
                                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 grid grid-cols-3 gap-4">
                                        {['Win Rate', 'Profit Factor', 'Avg Trade'].map((label, i) => (
                                            <div key={i} className="text-center">
                                                <div className="text-lg font-bold text-white">
                                                    {['62%', '1.8x', '+$342'][i]}
                                                </div>
                                                <div className="text-xs text-white/20 mt-1">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Streaks */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="lg:order-2 space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Flame className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white">Streaks</h3>
                                <div className="space-y-4 text-white/30 text-sm lg:text-base leading-relaxed">
                                    <p>
                                        Track your winning and losing streaks week by week. See the patterns
                                        your brain conveniently forgets—and the ones it catastrophizes.
                                    </p>
                                    <p className="text-white/20">
                                        <span className="text-white/40 font-medium">Why it matters emotionally:</span> Your
                                        reptile brain treats every loss like a trend. Streaks show you that a red
                                        week is almost always followed by a green one. It breaks the panic loop
                                        by giving you the one thing emotion can't: <span className="text-white/35">historical context.</span>
                                    </p>
                                </div>
                            </div>
                            <div className="lg:order-1 relative rounded-2xl border border-white/[0.06] bg-[#0d0d0f] p-1 overflow-hidden">
                                <div className="relative rounded-xl bg-gradient-to-bl from-amber-950/30 to-[#0d0d0f] p-8 lg:p-12">
                                    <div className="flex gap-2 flex-wrap">
                                        {['W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W', 'L', 'W', 'W'].map((r, i) => (
                                            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${r === 'W' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'}`}>
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/25">Current streak</span>
                                            <span className="text-emerald-400 font-medium">2 wins</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/25">Best streak</span>
                                            <span className="text-white/40 font-medium">9 wins</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/25">Worst streak</span>
                                            <span className="text-white/15 font-medium">1 loss</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edge */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-violet-400" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white">Edge</h3>
                                <div className="space-y-4 text-white/30 text-sm lg:text-base leading-relaxed">
                                    <p>
                                        Conviction analysis by ticker. Which positions actually make you
                                        money—and which are just expensive hobbies? Realized vs. unrealized
                                        gains, filtered by your profit threshold.
                                    </p>
                                    <p className="text-white/20">
                                        <span className="text-white/40 font-medium">Why it matters emotionally:</span> Every
                                        trader has their &ldquo;pet ticker&rdquo;—the one they love trading even when the
                                        data says stop. Edge exposes these blind spots. It doesn't argue with your
                                        feelings. It just shows you the scoreboard.
                                    </p>
                                </div>
                            </div>
                            <div className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d0f] p-1 overflow-hidden">
                                <div className="relative rounded-xl bg-gradient-to-br from-violet-950/30 to-[#0d0d0f] p-8 lg:p-12">
                                    <div className="space-y-4">
                                        {[
                                            { ticker: 'QQQ', pnl: '+$12,840', winRate: '71%', green: true },
                                            { ticker: 'GLD', pnl: '+$9,230', winRate: '83%', green: true },
                                            { ticker: 'SPY', pnl: '+$6,100', winRate: '64%', green: true },
                                            { ticker: 'TSLA', pnl: '-$2,840', winRate: '38%', green: false },
                                            { ticker: 'NVDA', pnl: '+$4,500', winRate: '55%', green: true }
                                        ].map((t, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.green ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    <span className="text-sm font-medium text-white/70">{t.ticker}</span>
                                                    <span className="text-xs text-white/15">{t.winRate} WR</span>
                                                </div>
                                                <span className={`text-sm font-mono font-medium ${t.green ? 'text-emerald-400' : 'text-rose-400'}`}>{t.pnl}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exposure */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="lg:order-2 space-y-5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white">Exposure</h3>
                                <div className="space-y-4 text-white/30 text-sm lg:text-base leading-relaxed">
                                    <p>
                                        A real-time treemap of your open positions. Size represents collateral
                                        at risk. Color shows today's price movement. One glance tells you
                                        exactly how concentrated your portfolio is.
                                    </p>
                                    <p className="text-white/20">
                                        <span className="text-white/40 font-medium">Why it matters emotionally:</span> Diversification
                                        isn't just math—it's emotional armor. When you can see that no single position
                                        dominates your portfolio, a bad day in one ticker doesn't feel like the end of the
                                        world. Exposure turns abstract risk into something you can actually see.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:order-1 relative rounded-2xl border border-white/[0.06] bg-[#0d0d0f] p-1 overflow-hidden">
                                <div className="relative rounded-xl bg-gradient-to-bl from-emerald-950/30 to-[#0d0d0f] p-8">
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { size: 3, label: 'GLD', color: 'bg-emerald-500/80' },
                                            { size: 2, label: 'SPY', color: 'bg-emerald-500/50' },
                                            { size: 1, label: 'QQQ', color: 'bg-emerald-500/30' },
                                            { size: 2, label: 'NVDA', color: 'bg-amber-500/40' },
                                            { size: 1, label: 'NEM', color: 'bg-amber-500/25' },
                                            { size: 2, label: 'TSLA', color: 'bg-rose-500/30' },
                                            { size: 1, label: 'CDE', color: 'bg-sky-500/25' },
                                            { size: 1, label: 'SIL', color: 'bg-sky-500/15' },
                                            { size: 1, label: 'HL', color: 'bg-violet-500/20' }
                                        ].map((tile, i) => (
                                            <div
                                                key={i}
                                                className={`${tile.color} rounded-lg flex items-center justify-center font-medium text-xs text-white/80`}
                                                style={{
                                                    gridRow: `span ${tile.size}`,
                                                    minHeight: tile.size === 3 ? '96px' : tile.size === 2 ? '64px' : '32px'
                                                }}
                                            >
                                                {tile.label}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between text-xs">
                                        <span className="text-white/20">14 open positions</span>
                                        <span className="text-emerald-400/60">$386K at risk</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative border-t border-white/[0.04] bg-[#0d0d0f]">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5" />
                <div className="max-w-3xl mx-auto px-6 lg:px-8 py-28 text-center relative">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Stop trading blind.
                    </h2>
                    <p className="text-white/25 text-base mb-10 max-w-md mx-auto">
                        Your broker shows you positions. We show you who you are as a trader.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate(createPageUrl('Trades'))}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-all hover:gap-3 group"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.04] bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex justify-between items-center">
                    <span className="text-sm text-white/20">DasKapitalist</span>
                    <span className="text-sm text-white/15">Built for traders, by traders.</span>
                </div>
            </footer>
        </div>
    );
}