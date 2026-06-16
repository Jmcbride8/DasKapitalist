import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, BarChart3, Zap, ArrowRight } from 'lucide-react';

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

            {/* Features strip — ultra minimal */}
            <section className="relative border-t border-white/[0.04] bg-[#0d0d0f]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                    <div className="grid md:grid-cols-3 gap-2">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Track Everything',
                                desc: 'Covered calls, CSPs, long options—7+ strategies with automatic P&L, yield, and collateral tracking.'
                            },
                            {
                                icon: BarChart3,
                                title: 'See Your Patterns',
                                desc: 'Streaks, win rates, ticker edge, exposure concentration. Four dashboards that show what matters.'
                            },
                            {
                                icon: Zap,
                                title: 'Move Fast',
                                desc: 'Bulk import, quick update mode, one-click close. Built for traders who value time.'
                            }
                        ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-all">
                                        <Icon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
                                </div>
                            );
                        })}
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