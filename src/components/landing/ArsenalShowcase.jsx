import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminImage from '@/components/landing/AdminImage';
import PriceTargetText from '@/components/landing/PriceTargetText';

const items = [
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
        desc: "Live treemap of every open position. Size equals collateral at risk. Color by today's price action. One look, total clarity.",
        imageKey: 'weapon_4',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
        stats: [
            { label: 'Open Positions', value: '14', up: null },
            { label: 'At Risk', value: '$386K', up: null },
            { label: 'Up Today', value: '9', up: true },
        ],
    },
];

const TRANSITION = {
    duration: 0.55,
    ease: [0.25, 0.46, 0.45, 0.94],
};

export default function ArsenalShowcase() {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = down, -1 = up

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const SCROLL_PER_CARD = window.innerHeight;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const scrolledIntoSection = -rect.top;
            if (scrolledIntoSection < 0) return;

            const index = Math.min(
                Math.floor(scrolledIntoSection / SCROLL_PER_CARD),
                items.length - 1
            );

            setActiveIndex(prev => {
                if (prev !== index) {
                    setDirection(index > prev ? 1 : -1);
                }
                return index;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const variants = {
        enter: (dir) => ({
            opacity: 0,
            y: dir > 0 ? 60 : -60,
            scale: 0.97,
        }),
        center: {
            opacity: 1,
            y: 0,
            scale: 1,
        },
        exit: (dir) => ({
            opacity: 0,
            y: dir > 0 ? -60 : 60,
            scale: 0.97,
        }),
    };

    const item = items[activeIndex];

    return (
        <section
            ref={sectionRef}
            className="relative"
            style={{
                height: `calc(100vh * ${items.length + 0.5})`,
                background: '#000000',
            }}
        >
            <div
                className="sticky top-0 h-screen flex flex-col justify-center px-6 lg:px-20 overflow-hidden"
                style={{ background: '#000000' }}
            >
                {/* Static header */}
                <div className="mb-10">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-4 font-mono">THE TOOLS</p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4">
                        <PriceTargetText>{`Four dashboards.\nTotal clarity.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10" />
                </div>

                {/* Animated card */}
                <div className="relative overflow-hidden" style={{ minHeight: '380px' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={TRANSITION}
                            className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center"
                        >
                            {/* Realistic Laptop Mockup */}
                            <div className="relative w-full" style={{ perspective: '1200px' }}>
                                <div style={{ transform: 'rotateX(4deg)', transformStyle: 'preserve-3d' }}>

                                    {/* ── LID / SCREEN ── */}
                                    <div
                                        className="relative w-full"
                                        style={{
                                            background: 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2a2a2c 100%)',
                                            borderRadius: '14px 14px 0 0',
                                            padding: '10px 10px 0 10px',
                                            boxShadow: '0 -2px 0 rgba(255,255,255,0.08) inset, 0 2px 0 rgba(0,0,0,0.5) inset',
                                        }}
                                    >
                                        {/* Apple-logo-style shine spot on lid back (decorative) */}
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

                                        {/* Screen bezel */}
                                        <div
                                            className="relative w-full overflow-hidden"
                                            style={{
                                                background: '#0a0a0a',
                                                borderRadius: '8px 8px 0 0',
                                                aspectRatio: '16/10',
                                                boxShadow: '0 0 0 1.5px rgba(255,255,255,0.04) inset',
                                            }}
                                        >
                                            {/* Top bezel with camera */}
                                            <div className="absolute top-0 left-0 right-0 flex items-center justify-center z-10" style={{ height: '22px', background: '#0a0a0a' }}>
                                                <div className="w-2 h-2 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-zinc-600" />
                                                </div>
                                            </div>

                                            {/* Screen content */}
                                            <div className="absolute inset-0 overflow-hidden" style={{ top: '22px', borderRadius: '0 0 8px 8px' }}>
                                                <AdminImage
                                                    imageKey={item.imageKey}
                                                    defaultSrc={item.image}
                                                    className="w-full h-full"
                                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center top' }}
                                                    alt={item.title}
                                                />
                                            </div>

                                            {/* Screen glare */}
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
                                                    borderRadius: '0 0 8px 8px',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* ── HINGE ── */}
                                    <div
                                        className="w-full"
                                        style={{
                                            height: '5px',
                                            background: 'linear-gradient(180deg, #111 0%, #2a2a2c 50%, #111 100%)',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.9)',
                                        }}
                                    />

                                    {/* ── BASE / KEYBOARD ── */}
                                    <div
                                        className="relative w-full"
                                        style={{
                                            background: 'linear-gradient(180deg, #2e2e30 0%, #1c1c1e 60%, #161618 100%)',
                                            borderRadius: '0 0 10px 10px',
                                            padding: '10px 12px 6px',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.9), 0 2px 0 rgba(255,255,255,0.05) inset',
                                        }}
                                    >
                                        {/* Keyboard rows */}
                                        {[
                                            { keys: 13, height: 5 },
                                            { keys: 12, height: 5 },
                                            { keys: 11, height: 5 },
                                            { keys: 10, height: 5 },
                                        ].map((row, ri) => (
                                            <div key={ri} className="flex gap-0.5 mb-0.5 justify-center">
                                                {Array.from({ length: row.keys }).map((_, ki) => (
                                                    <div
                                                        key={ki}
                                                        className="flex-1 rounded-sm"
                                                        style={{
                                                            height: `${row.height}px`,
                                                            background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)',
                                                            boxShadow: '0 1px 0 rgba(0,0,0,0.5), 0 -0.5px 0 rgba(255,255,255,0.06) inset',
                                                            maxWidth: '26px',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ))}

                                        {/* Space bar row */}
                                        <div className="flex gap-0.5 mt-0.5 justify-center items-center">
                                            <div className="flex-1 rounded-sm" style={{ height: '5px', maxWidth: '20px', background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
                                            <div className="flex-1 rounded-sm" style={{ height: '5px', maxWidth: '20px', background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
                                            <div className="rounded-sm" style={{ height: '5px', width: '120px', background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
                                            <div className="flex-1 rounded-sm" style={{ height: '5px', maxWidth: '20px', background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
                                            <div className="flex-1 rounded-sm" style={{ height: '5px', maxWidth: '20px', background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
                                        </div>

                                        {/* Trackpad */}
                                        <div className="flex justify-center mt-2">
                                            <div
                                                className="rounded-md"
                                                style={{
                                                    width: '80px',
                                                    height: '52px',
                                                    background: 'linear-gradient(180deg, #2a2a2c 0%, #242426 100%)',
                                                    boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.6) inset',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* ── DESK SHADOW ── */}
                                    <div
                                        className="w-full mt-1"
                                        style={{
                                            height: '6px',
                                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)',
                                            filter: 'blur(4px)',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <div>
                                <div className="flex items-baseline gap-4 mb-4">
                                    <span className="text-5xl font-black text-white/10 leading-none select-none">{item.num}</span>
                                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                                </div>
                                <p className="text-base text-white/70 leading-relaxed font-sans mb-8">{item.desc}</p>
                                <div className="flex gap-8 pt-6 border-t border-white/10">
                                    {item.stats.map((s) => (
                                        <div key={s.label}>
                                            <div className="flex items-center gap-1.5 text-base font-black text-white">
                                                {s.value}
                                                {s.up === true && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                                                {s.up === false && <TrendingDown className="w-4 h-4 text-red-400" />}
                                            </div>
                                            <div className="text-[9px] font-bold text-white/25 uppercase tracking-wider mt-1">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 mt-10">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className="h-0.5 rounded-full transition-all duration-500"
                            style={{
                                width: i === activeIndex ? '32px' : '12px',
                                backgroundColor: i === activeIndex ? '#10b981' : 'rgba(255,255,255,0.2)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}