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
                            {/* Laptop mockup — inline SVG frame with screenshot inset */}
                            <div className="relative w-full">
                                <svg
                                    viewBox="0 0 800 520"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full drop-shadow-2xl"
                                >
                                    <defs>
                                        <clipPath id={`screen-clip-${activeIndex}`}>
                                            <rect x="92" y="22" width="616" height="378" rx="3" ry="3" />
                                        </clipPath>
                                        <linearGradient id="lid-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4a4a4c" />
                                            <stop offset="100%" stopColor="#1e1e20" />
                                        </linearGradient>
                                        <linearGradient id="base-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3a3a3c" />
                                            <stop offset="100%" stopColor="#1a1a1c" />
                                        </linearGradient>
                                        <linearGradient id="hinge-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#111" />
                                            <stop offset="50%" stopColor="#2a2a2c" />
                                            <stop offset="100%" stopColor="#111" />
                                        </linearGradient>
                                    </defs>

                                    {/* ── LID ── */}
                                    <rect x="66" y="4" width="668" height="416" rx="12" ry="12" fill="url(#lid-grad)" />
                                    {/* lid inner shadow top */}
                                    <rect x="66" y="4" width="668" height="6" rx="6" fill="rgba(255,255,255,0.07)" />
                                    {/* Camera notch */}
                                    <rect x="88" y="4" width="624" height="18" rx="0" fill="#1a1a1c" />
                                    <circle cx="400" cy="13" r="3.5" fill="#2a2a2c" />
                                    <circle cx="400" cy="13" r="1.5" fill="#333" />

                                    {/* ── SCREEN BEZEL ── */}
                                    <rect x="88" y="20" width="624" height="384" rx="4" ry="4" fill="#0a0a0a" />

                                    {/* ── SCREENSHOT (clipped inside screen) ── */}
                                    <foreignObject
                                        x="92" y="22"
                                        width="616" height="378"
                                        clipPath={`url(#screen-clip-${activeIndex})`}
                                    >
                                        <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                            <AdminImage
                                                imageKey={item.imageKey}
                                                defaultSrc={item.image}
                                                className="w-full h-full"
                                                style={{ backgroundSize: 'cover', backgroundPosition: 'center top' }}
                                                alt={item.title}
                                            />
                                        </div>
                                    </foreignObject>

                                    {/* Screen glare */}
                                    <rect x="92" y="22" width="616" height="378" rx="2" fill="url(#glare)" opacity="0.04" />
                                    <defs>
                                        <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="white" stopOpacity="1" />
                                            <stop offset="50%" stopColor="white" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* ── HINGE ── */}
                                    <rect x="66" y="418" width="668" height="7" fill="url(#hinge-grad)" />

                                    {/* ── BASE ── */}
                                    <rect x="56" y="425" width="688" height="58" rx="4" ry="4" fill="url(#base-grad)" />
                                    {/* base top highlight */}
                                    <rect x="56" y="425" width="688" height="3" fill="rgba(255,255,255,0.06)" />

                                    {/* Keyboard area (simplified rows) */}
                                    {[0,1,2,3].map(row => (
                                        Array.from({ length: 13 }).map((_, k) => (
                                            <rect
                                                key={`${row}-${k}`}
                                                x={76 + k * 49}
                                                y={431 + row * 10}
                                                width="44"
                                                height="8"
                                                rx="1.5"
                                                fill="#2e2e30"
                                                stroke="rgba(0,0,0,0.4)"
                                                strokeWidth="0.5"
                                            />
                                        ))
                                    ))}
                                    {/* Spacebar */}
                                    <rect x="240" y="471" width="320" height="8" rx="2" fill="#2e2e30" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />

                                    {/* Trackpad */}
                                    <rect x="320" y="482" width="160" height="0" rx="3" fill="#252527" />

                                    {/* Bottom foot shadow */}
                                    <ellipse cx="400" cy="488" rx="200" ry="6" fill="rgba(0,0,0,0.5)" />

                                    {/* Bottom edge rounded foot */}
                                    <rect x="56" y="479" width="688" height="4" rx="2" fill="#111" />
                                </svg>
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