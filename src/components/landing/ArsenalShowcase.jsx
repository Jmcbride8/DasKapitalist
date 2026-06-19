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
        image: null,
        stats: [
            { label: 'Win Rate', value: '62%', up: true },
            { label: 'Profit Factor', value: '1.8×', up: true },
            { label: 'Total P&L', value: '+$47,280', up: true },
        ],
    },
    {
        num: '02',
        title: 'Streaks',
        desc: 'Every week is a vote. Momentum. Slumps. Turning points. Know when you\'re locked in — and when you\'re hemorrhaging edge.',
        imageKey: 'weapon_2',
        image: null,
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
        image: null,
        stats: [
            { label: 'Top Ticker', value: 'GLD (+$14K)', up: true },
            { label: 'Worst Ticker', value: 'TSLA (-$5K)', up: false },
            { label: 'Total Tickers', value: '12', up: null },
        ],
    },
    {
        num: '04',
        title: 'Exposure',
        desc: "See your risk. Know your edge. Every open position laid bare — capital deployed, gains and losses stacked on top. Green means you're right. Red means you're bleeding. Cut it fast.",
        imageKey: 'weapon_4',
        image: null,
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

function getScrollParent(el) {
    if (!el) return window;
    const style = getComputedStyle(el);
    const overflow = style.overflow + style.overflowY + style.overflowX;
    if (/auto|scroll/.test(overflow)) return el;
    return getScrollParent(el.parentElement);
}

export default function ArsenalShowcase() {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const scrollEl = getScrollParent(section.parentElement);
        const getScrollTop = () => scrollEl === window ? window.scrollY : scrollEl.scrollTop;
        const getElementTop = () => scrollEl === window
            ? section.getBoundingClientRect().top + window.scrollY
            : section.offsetTop;

        const SCROLL_PER_CARD = window.innerHeight;

        const handleScroll = () => {
            const scrolledIntoSection = getScrollTop() - getElementTop();
            if (scrolledIntoSection < 0) return;

            const index = Math.min(
                Math.floor(scrolledIntoSection / SCROLL_PER_CARD),
                items.length - 1
            );

            setActiveIndex(prev => {
                if (prev !== index) setDirection(index > prev ? 1 : -1);
                return index;
            });
        };

        scrollEl.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => scrollEl.removeEventListener('scroll', handleScroll);
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
                className="sticky top-0 h-screen flex flex-col justify-start pt-16 lg:pt-20 px-6 lg:px-20 overflow-hidden"
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
                <div className="relative overflow-hidden" style={{ minHeight: '520px' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={TRANSITION}
                            className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
                        >
                            {/* Apple-style MacBook mockup — 2/3 width */}
                            <div className="relative flex flex-col items-center w-full lg:w-[55%] shrink-0" style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.9))' }}>
                                {/* Lid / screen */}
                                <div
                                    className="relative w-full overflow-hidden"
                                    style={{
                                        borderRadius: '16px 16px 0 0',
                                        background: 'linear-gradient(160deg, #4a4a4a 0%, #2c2c2c 40%, #1e1e1e 100%)',
                                        padding: '3px',
                                        paddingBottom: '0',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {/* Inner bezel */}
                                    <div
                                        className="relative overflow-hidden"
                                        style={{
                                            borderRadius: '14px 14px 0 0',
                                            background: '#0a0a0a',
                                            padding: '8px 8px 0',
                                        }}
                                    >
                                        {/* Camera notch */}
                                        <div className="flex justify-center mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        </div>
                                        {/* Screen content */}
                                        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', borderRadius: '4px 4px 0 0' }}>
                                            <AdminImage
                                                imageKey={item.imageKey}
                                                className="w-full h-full"
                                                style={{ backgroundSize: 'cover', backgroundPosition: 'center top' }}
                                                alt={item.title}
                                            />
                                            {/* Subtle screen glare */}
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hinge line */}
                                <div
                                    className="w-full h-[3px]"
                                    style={{ background: 'linear-gradient(180deg, #111 0%, #222 50%, #111 100%)' }}
                                />

                                {/* Base / keyboard deck */}
                                <div
                                    className="w-full h-5"
                                    style={{
                                        background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #222 100%)',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                                        borderRadius: '0 0 4px 4px',
                                    }}
                                >
                                    {/* Trackpad hint */}
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-16 h-2.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }} />
                                    </div>
                                </div>

                                {/* Foot / desk reflection */}
                                <div
                                    className="w-4/5 h-[3px] rounded-b-full"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                                />
                            </div>

                            {/* Text column — 1/3 width */}
                            <div className="flex flex-col justify-center gap-8 flex-1 min-w-0">
                                <div>
                                    <div className="flex items-baseline gap-3 mb-3">
                                        <span className="text-5xl font-black text-white/10 leading-none select-none">{item.num}</span>
                                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-sans">{item.desc}</p>
                                </div>
                                <div className="flex flex-col gap-5 pt-6 border-t border-white/10">
                                    {item.stats.map((s) => (
                                        <div key={s.label}>
                                            <div className="flex items-center gap-1.5 text-lg font-black text-white">
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