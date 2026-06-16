import React from 'react';
import { ArrowRight, Terminal, Cpu } from 'lucide-react';

export default function DataTerminalLanding({ navigate, openView }) {
    return (
        <div className="bg-black text-[#00FF41] font-mono overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Scanline effect */}
                <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)' }} />

                {/* Hero */}
                <div className="min-h-screen flex flex-col justify-center px-6 lg:px-12 py-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Terminal className="w-5 h-5" />
                            <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">SYS://DASKAPITALIST/INIT</span>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight">
                                &gt; 90% OF TRADERS
                                <br />
                                &gt; ARE BLEEDING OUT
                                <br />
                                &gt; YOU? DIFFERENT.
                            </h1>
                            <div className="flex items-center gap-2 text-sm opacity-70">
                                <Cpu className="w-3 h-3" />
                                <span className="animate-pulse">█ PROCESSING MARKET DATA</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#00FF41] text-[#00FF41] font-bold text-xs tracking-wider uppercase hover:bg-[#00FF41] hover:text-black transition-all group">
                                ./LAUNCH_APP
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Live data ticker */}
                    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px border border-[#00FF41]/20">
                        {[
                            { label: 'TRADES_LOGGED', value: '> 2,847' },
                            { label: 'WIN_RATE', value: '62.4%' },
                            { label: 'PROFIT_FACTOR', value: '1.83×' },
                            { label: 'CUMUL_P&L', value: '+$47,280' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 border border-[#00FF41]/10" style={{ backgroundColor: 'rgba(0,255,65,0.02)' }}>
                                <div className="text-[8px] tracking-[0.25em] uppercase opacity-40 mb-2">{stat.label}</div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-[10px] opacity-30">[CONNECTED] lat: 14ms | udev: /dev/ttyS0 | baud: 115200</div>
                </div>

                {/* Section: Terminal Dashboard */}
                <div className="px-6 lg:px-12 py-20 border-t border-[#00FF41]/10">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="text-[#00FF41]/40">$</span>
                        <h2 className="text-2xl font-bold">cat /var/log/trades | grep edge</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { ticker: 'GLD', pnl: '+$14,200', wr: '83%', sig: 'STRONG_BUY' },
                            { ticker: 'QQQ', pnl: '+$11,840', wr: '71%', sig: 'BUY' },
                            { ticker: 'SPY', pnl: '+$8,300', wr: '64%', sig: 'BUY' },
                            { ticker: 'NVDA', pnl: '+$3,100', wr: '55%', sig: 'HOLD' },
                            { ticker: 'TSLA', pnl: '-$4,920', wr: '38%', sig: 'SELL' },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center px-6 py-4 border border-[#00FF41]/10" style={{ backgroundColor: row.sig === 'SELL' ? 'rgba(255,0,0,0.05)' : 'rgba(0,255,65,0.02)' }}>
                                <span className="text-sm font-bold w-20">{'>'} {row.ticker}</span>
                                <span className="text-sm font-bold w-28" style={{ color: row.pnl.startsWith('+') ? '#00FF41' : '#FF3333' }}>{row.pnl}</span>
                                <span className="text-xs opacity-50 w-16">{row.wr} WR</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 border ml-auto" style={{
                                    borderColor: row.sig === 'SELL' ? '#FF3333' : row.sig === 'STRONG_BUY' ? '#00FF41' : '#00FF41',
                                    color: row.sig === 'SELL' ? '#FF3333' : '#00FF41',
                                }}>{row.sig}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => openView('ticker')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-8 opacity-50 hover:opacity-100 transition-opacity">
                        $ cat /var/log/edge
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Section: Your System */}
                <div className="px-6 lg:px-12 py-20 border-t border-[#00FF41]/10">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[#00FF41]/40">$</span>
                        <h2 className="text-2xl font-bold">systemctl status trading-brain</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Without DasKapitalist */}
                        <div className="border border-red-500/20 p-8" style={{ backgroundColor: 'rgba(255,0,0,0.03)' }}>
                            <div className="text-xs font-bold text-red-400 tracking-wider uppercase mb-6">// WITHOUT DASKAPITALIST</div>
                            <div className="space-y-3 text-sm">
                                {[
                                    '[FAIL] amygdala.sys — panic-active',
                                    '[FAIL] cortisol.daemon — flooding',
                                    '[FAIL] logic.circuit — disconnected',
                                    '[FAIL] risk.mgmt — offline',
                                ].map((line, i) => (
                                    <div key={i} className="font-mono text-red-400/70">{line}</div>
                                ))}
                            </div>
                            <div className="mt-6 text-[8px] text-red-400/30 tracking-[0.3em] uppercase">SYSTEM STATUS: UNSTABLE</div>
                        </div>

                        {/* With DasKapitalist */}
                        <div className="border border-[#00FF41]/20 p-8" style={{ backgroundColor: 'rgba(0,255,65,0.02)' }}>
                            <div className="text-xs font-bold text-[#00FF41] tracking-wider uppercase mb-6">// WITH DASKAPITALIST</div>
                            <div className="space-y-3 text-sm">
                                {[
                                    '[OK]    edge.scanner — live',
                                    '[OK]    streak.monitor — tracking',
                                    '[OK]    exposure.map — rendering',
                                    '[OK]    emotion.sentry — armed',
                                ].map((line, i) => (
                                    <div key={i} className="font-mono text-[#00FF41]/70">{line}</div>
                                ))}
                            </div>
                            <div className="mt-6 text-[8px] text-[#00FF41]/40 tracking-[0.3em] uppercase">SYSTEM STATUS: OPTIMAL</div>
                        </div>
                    </div>
                </div>

                {/* Section: Arsenal */}
                <div className="px-6 lg:px-12 py-20 border-t border-[#00FF41]/10">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="text-[#00FF41]/40">$</span>
                        <h2 className="text-2xl font-bold">ls /opt/daskapitalist/weapons/</h2>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-4">
                        {['track_record.bin', 'streaks.bin', 'edge.bin', 'exposure.bin'].map((name, i) => (
                            <div key={i} className="border border-[#00FF41]/10 p-6 hover:border-[#00FF41]/40 transition-colors group" style={{ backgroundColor: 'rgba(0,255,65,0.01)' }}>
                                <div className="text-xs font-bold text-[#00FF41] mb-2">0{i+1}</div>
                                <div className="text-sm font-bold group-hover:text-[#00FF41] transition-colors">{name}</div>
                                <div className="text-[8px] opacity-30 mt-3 tracking-wider uppercase">-rwxr-xr-x 1 root root</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="px-6 lg:px-12 py-20 border-t border-[#00FF41]/10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-[#00FF41]/40">$</span>
                        <span className="text-lg font-bold">./deploy —now</span>
                    </div>
                    <p className="text-sm opacity-40 max-w-md mx-auto mb-8">
                        Your broker shows positions. We show system diagnostics. Stop trading blind.
                    </p>
                    <button onClick={() => navigate('/Trades')} className="inline-flex items-center gap-2 px-10 py-4 border border-[#00FF41] text-[#00FF41] font-bold text-xs tracking-wider uppercase hover:bg-[#00FF41] hover:text-black transition-all group">
                        INITIALIZE SYSTEM
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 lg:px-12 py-6 border-t border-[#00FF41]/10 flex justify-between">
                    <span className="text-[9px] opacity-20 tracking-[0.3em] uppercase">DasKapitalist v3.2.7</span>
                    <span className="text-[9px] opacity-10 tracking-[0.3em] uppercase">PID: 28471 | UPTIME: 847d</span>
                </div>
            </div>
        </div>
    );
}