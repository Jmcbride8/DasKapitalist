import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, ArrowDown, Skull } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="bg-white text-black overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-screen flex items-center bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
                    <div className="max-w-4xl">
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-px w-12 bg-black/20" />
                            <span className="text-xs font-semibold tracking-[0.2em] text-black/40 uppercase">For Options Traders</span>
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92]">
                                <span className="text-black">90% of day</span>
                                <br />
                                <span className="text-black">traders lose</span>
                                <br />
                                <span className="text-black/20">money. Don't.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-black/35 max-w-xl leading-relaxed font-medium">
                                Not because they're dumb. Because their reptile brain hijacks
                                every decision the moment they see red. DasKapitalist is the
                                system that gives you perspective when your brain is screaming panic.
                            </p>

                            {/* Big stat */}
                            <div className="flex items-baseline gap-3 pt-4">
                                <span className="text-8xl md:text-9xl font-black tabular-nums text-black">90%</span>
                                <span className="text-sm font-semibold text-black/25 max-w-[120px] leading-tight">
                                    of retail traders lose money in their first year
                                </span>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={() => navigate(createPageUrl('Trades'))}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black text-white rounded-2xl font-bold text-base hover:bg-black/85 transition-all hover:gap-3 group"
                                >
                                    Launch the app
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                                <button
                                    onClick={() => {
                                        document.getElementById('views').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-black/10 text-black/60 rounded-2xl font-bold text-base hover:border-black/25 hover:text-black transition-all"
                                >
                                    See how it works
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Animal */}
            <section className="relative bg-[#fafafa] border-y border-black/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100">
                                <Skull className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-xs font-bold text-rose-500 tracking-wider uppercase">The Animal</span>
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.05]">
                                You are a lizard
                                <br />
                                <span className="text-black/20">wearing a suit.</span>
                            </h2>

                            <div className="space-y-5 text-black/40 text-base lg:text-lg leading-relaxed">
                                <p>
                                    The moment your position turns red, your amygdala fires.
                                    The same neural circuit that kept your ancestors alive
                                    when they saw a predator. Cortisol floods your system.
                                    Your prefrontal cortex — the part that does math, strategy,
                                    risk management — goes offline.
                                </p>
                                <p>
                                    You know what happens next because you've done it.
                                    You close the winner too early. You let the loser run
                                    because closing means admitting you were wrong. You
                                    revenge-trade. You size up. You break every rule in your
                                    playbook.
                                </p>
                                <p className="text-black/60 font-semibold">
                                    You don't need a better strategy. You need a system
                                    that works <span className="italic">when your brain doesn't.</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl border-2 border-black/5 bg-white p-8 lg:p-12 shadow-sm">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-black/25 uppercase tracking-wider">Brain under stress</span>
                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Cortisol Active</span>
                                    </div>

                                    {[
                                        { label: 'Prefrontal Cortex', subtitle: '(Logic, Strategy)', active: false },
                                        { label: 'Amygdala', subtitle: '(Fear, Panic)', active: true },
                                        { label: 'Hippocampus', subtitle: '(Memory, Context)', active: false },
                                    ].map((region, i) => (
                                        <div key={i} className={`p-4 rounded-xl border transition-all ${region.active ? 'border-rose-200 bg-rose-50/50' : 'border-black/5 bg-white'}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-bold ${region.active ? 'text-rose-600' : 'text-black/30'}`}>
                                                    {region.label}
                                                </span>
                                                <div className={`w-2 h-2 rounded-full ${region.active ? 'bg-rose-400 animate-pulse' : 'bg-black/10'}`} />
                                            </div>
                                            <span className={`text-xs ${region.active ? 'text-rose-400' : 'text-black/20'}`}>
                                                {region.subtitle} — {region.active ? 'DOMINANT' : 'suppressed'}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="pt-2 border-t border-black/[0.04]">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-black/25">Result of each trade</span>
                                            <span className="text-rose-400 font-bold">Emotion-driven</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The System */}
            <section id="views" className="relative bg-white py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-24">
                        <div className="h-px w-16 bg-black/15 mb-8" />
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] max-w-3xl">
                            Four dashboards that do what your brain can't.
                        </h2>
                        <p className="text-lg text-black/25 mt-4 max-w-xl">
                            Each one answers a question your brokerage app will never ask.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {/* 1. Track Record */}
                        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="text-6xl font-black text-black/5 tabular-nums">01</div>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight">Track Record</h3>
                                <div className="h-px w-8 bg-black/15 my-4" />
                                <p className="text-black/35 text-base leading-relaxed">
                                    Your real P&L. Not the sanitized number your broker shows. Every trade,
                                    every ticker, every strategy — cumulative, undeniable.
                                </p>
                                <p className="text-black/45 font-semibold text-sm leading-relaxed">
                                    When you're down bad and want to quit, this tells you the long trend
                                    is still up. When you're euphoric after a heater, this keeps you humble.
                                    It replaces feelings with facts.
                                </p>
                                <button
                                    onClick={() => navigate(createPageUrl('Dashboards?view=time'))}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors group pt-2"
                                >
                                    Open Track Record
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <div className="lg:col-span-3 rounded-3xl border border-black/[0.06] bg-[#fafafa] p-8 lg:p-10">
                                <div className="grid grid-cols-3 gap-8 mb-8">
                                    {[
                                        { value: '62%', label: 'Win Rate', color: 'text-black' },
                                        { value: '1.8×', label: 'Profit Factor', color: 'text-black' },
                                        { value: '+$342', label: 'Avg per trade', color: 'text-emerald-600' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className={`text-2xl lg:text-3xl font-black ${stat.color}`}>{stat.value}</div>
                                            <div className="text-xs text-black/25 mt-1 font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-black/60">Cumulative P&L</span>
                                        <span className="text-emerald-600">+$47,280</span>
                                    </div>
                                    <div className="h-3 bg-black/[0.04] rounded-full overflow-hidden">
                                        <div className="h-full bg-black rounded-full" style={{ width: '72%' }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-black/15">
                                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Streaks */}
                        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="text-6xl font-black text-black/5 tabular-nums">02</div>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight">Streaks</h3>
                                <div className="h-px w-8 bg-black/15 my-4" />
                                <p className="text-black/35 text-base leading-relaxed">
                                    Every W and L, week by week. See the patterns your brain
                                    conveniently forgets — and the ones it catastrophizes.
                                </p>
                                <p className="text-black/45 font-semibold text-sm leading-relaxed">
                                    Your lizard brain treats every L like a trend. Streaks prove
                                    a red week is almost always followed by green. It breaks the
                                    panic loop with the one thing emotion can't argue with: data.
                                </p>
                                <button
                                    onClick={() => navigate(createPageUrl('Dashboards?view=weekly'))}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors group pt-2"
                                >
                                    Open Streaks
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <div className="lg:col-span-3 rounded-3xl border border-black/[0.06] bg-[#fafafa] p-8 lg:p-10">
                                <div className="flex gap-3 flex-wrap mb-8">
                                    {['W','W','W','W','L','W','W','W','W','W','W','L','W','W'].map((r, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border-2 ${r === 'W' ? 'bg-black text-white border-black' : 'bg-white text-black/25 border-black/[0.06]'}`}>
                                            {r}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Current', value: '3 wins', color: 'text-emerald-600' },
                                        { label: 'Best ever', value: '11 wins', color: 'text-black' },
                                        { label: 'Worst ever', value: '1 loss', color: 'text-black/25' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-black/[0.04] p-4">
                                            <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                                            <div className="text-[10px] font-bold text-black/20 uppercase tracking-wider mt-0.5">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Edge */}
                        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="text-6xl font-black text-black/5 tabular-nums">03</div>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight">Edge</h3>
                                <div className="h-px w-8 bg-black/15 my-4" />
                                <p className="text-black/35 text-base leading-relaxed">
                                    Which tickers make you money — and which are just expensive
                                    hobbies? Realized P&L per ticker, sorted cold.
                                </p>
                                <p className="text-black/45 font-semibold text-sm leading-relaxed">
                                    Every trader has a pet ticker they love even when the data
                                    screams stop. Edge exposes your blind spots. It doesn't argue
                                    with your feelings — it just shows you the scoreboard.
                                </p>
                                <button
                                    onClick={() => navigate(createPageUrl('Dashboards?view=ticker'))}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors group pt-2"
                                >
                                    Open Edge
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <div className="lg:col-span-3 rounded-3xl border border-black/[0.06] bg-[#fafafa] p-8 lg:p-10">
                                <div className="space-y-3">
                                    {[
                                        { ticker: 'GLD', pnl: '+$14,200', wr: '83%', up: true },
                                        { ticker: 'QQQ', pnl: '+$11,840', wr: '71%', up: true },
                                        { ticker: 'SPY', pnl: '+$8,300', wr: '64%', up: true },
                                        { ticker: 'NVDA', pnl: '+$3,100', wr: '55%', up: true },
                                        { ticker: 'TSLA', pnl: '-$4,920', wr: '38%', up: false },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-black/[0.04]">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-black text-black">{t.ticker}</span>
                                                <span className={`text-xs font-bold ${t.up ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                    {t.wr} WR
                                                </span>
                                            </div>
                                            <span className={`text-sm font-black font-mono ${t.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {t.pnl}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Exposure */}
                        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="text-6xl font-black text-black/5 tabular-nums">04</div>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight">Exposure</h3>
                                <div className="h-px w-8 bg-black/15 my-4" />
                                <p className="text-black/35 text-base leading-relaxed">
                                    A live treemap of everything you have open. Size is your
                                    collateral at risk. Color is today's price action. One look.
                                </p>
                                <p className="text-black/45 font-semibold text-sm leading-relaxed">
                                    Diversification is emotional armor. When you see no single
                                    position dominates your book, a bad candle doesn't feel like the
                                    end of your career. Exposure makes risk visible — and thus manageable.
                                </p>
                                <button
                                    onClick={() => navigate(createPageUrl('Dashboards?view=open'))}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors group pt-2"
                                >
                                    Open Exposure
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <div className="lg:col-span-3 rounded-3xl border border-black/[0.06] bg-[#fafafa] p-8 lg:p-10">
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { size: 3, label: 'GLD', bg: 'bg-black', text: 'text-white' },
                                        { size: 2, label: 'SPY', bg: 'bg-black/70', text: 'text-white' },
                                        { size: 1, label: 'QQQ', bg: 'bg-black/40', text: 'text-white' },
                                        { size: 2, label: 'NVDA', bg: 'bg-black/25', text: 'text-black/60' },
                                        { size: 1, label: 'NEM', bg: 'bg-black/15', text: 'text-black/40' },
                                        { size: 2, label: 'TSLA', bg: 'bg-black/10', text: 'text-black/30' },
                                        { size: 1, label: 'CDE', bg: 'bg-black/[0.06]', text: 'text-black/25' },
                                        { size: 1, label: 'SIL', bg: 'bg-black/[0.04]', text: 'text-black/20' },
                                        { size: 1, label: 'HL', bg: 'bg-black/[0.03]', text: 'text-black/15' },
                                    ].map((tile, i) => (
                                        <div
                                            key={i}
                                            className={`${tile.bg} ${tile.text} rounded-xl flex items-center justify-center font-black text-xs`}
                                            style={{
                                                gridRow: `span ${tile.size}`,
                                                minHeight: tile.size === 3 ? '96px' : tile.size === 2 ? '64px' : '32px'
                                            }}
                                        >
                                            {tile.label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/[0.04]">
                                    <span className="text-xs font-bold text-black/20">14 positions</span>
                                    <span className="text-xs font-black text-black/40">$386K at risk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="relative bg-[#fafafa] border-y border-black/[0.06]">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
                    <p className="text-2xl lg:text-3xl font-black text-black/15 italic leading-relaxed">
                        &ldquo;The stock market is a device for transferring money
                        from the impatient to the patient.&rdquo;
                    </p>
                    <p className="text-sm font-bold text-black/20 mt-4">— Warren Buffett</p>
                </div>
            </section>

            {/* CTA */}
            <section className="relative bg-white py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                        Don't be the 90%.
                    </h2>
                    <p className="text-lg text-black/25 max-w-md mx-auto mb-10">
                        Your broker shows you positions. We show you the trader behind them.
                    </p>
                    <button
                        onClick={() => navigate(createPageUrl('Trades'))}
                        className="inline-flex items-center gap-2 px-12 py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-black/85 transition-all hover:gap-3 group shadow-lg shadow-black/10"
                    >
                        Start tracking
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-black/[0.04] bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex justify-between items-center">
                    <span className="text-sm font-bold text-black/15">DasKapitalist</span>
                    <span className="text-sm font-medium text-black/10">Built for traders, by traders.</span>
                </div>
            </footer>
        </div>
    );
}