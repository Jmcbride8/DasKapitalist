import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminImage from '@/components/landing/AdminImage';
import PriceTargetText from '@/components/landing/PriceTargetText';

const problems = [
    {
        imageKey: 'problem_1',
        title: 'Revenge Trading',
        desc: "You take a loss and immediately double down to get it back. The market doesn't care about your feelings — and neither does your account balance.",
    },
    {
        imageKey: 'problem_2',
        title: 'Overtrading',
        desc: "You exit winners too early and hold losers too long. You chase entries. You break your own rules. Discipline isn't sexy — but it's the only thing that compounds.",
    },
    {
        imageKey: 'problem_3',
        title: 'Capitulation',
        desc: "One bad week and you abandon your strategy. Fear turns a manageable drawdown into a blown account. The data would have told you to hold — if you'd been tracking it.",
    },
    {
        imageKey: 'problem_4',
        title: 'Edge Blindness',
        desc: "You don't know which tickers actually print for you. Without per-symbol analytics, you keep feeding the losers and starving the winners.",
    },
];

const TRANSITION = {
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94],
};

function getScrollParent(el) {
    if (!el) return window;
    const style = getComputedStyle(el);
    const overflow = style.overflow + style.overflowY + style.overflowX;
    if (/auto|scroll/.test(overflow)) return el;
    return getScrollParent(el.parentElement);
}

export default function ProblemsShowcase() {
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
                problems.length - 1
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
        enter: (dir) => ({ opacity: 0, y: dir > 0 ? 60 : -60, scale: 0.97 }),
        center: { opacity: 1, y: 0, scale: 1 },
        exit: (dir) => ({ opacity: 0, y: dir > 0 ? -60 : 60, scale: 0.97 }),
    };

    const problem = problems[activeIndex];

    return (
        <section
            ref={sectionRef}
            className="relative"
            style={{
                height: `calc(100vh * ${problems.length + 0.5})`,
                background: '#000',
            }}
        >
            <div
                className="sticky top-0 h-screen flex flex-col overflow-hidden"
                style={{ background: '#000' }}
            >
                {/* ── MOBILE LAYOUT ── */}
                <div className="flex flex-col h-full lg:hidden">
                    {/* Compact header */}
                    <div className="px-5 pt-10 pb-3 shrink-0">
                        <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/50 mb-2 font-mono">
                            EMOTIONS BEAT INTELLIGENCE
                        </p>
                        <h2 className="text-3xl font-black uppercase leading-[0.92] tracking-tighter text-white">
                            The math is easy.<br />Emotional mastery isn't.
                        </h2>
                    </div>

                    {/* Full-bleed image card with overlaid text */}
                    <div className="relative flex-1 min-h-0 mx-5 mb-5 rounded-2xl overflow-hidden border border-white/10">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                className="absolute inset-0"
                            >
                                {/* Background image */}
                                <AdminImage
                                    imageKey={problem.imageKey}
                                    className="w-full h-full"
                                    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    alt={problem.title}
                                />
                                {/* Gradient overlay for text legibility */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.1) 100%)' }}
                                />
                                {/* Overlaid text at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black text-white/10 leading-none select-none">0{activeIndex + 1}</span>
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight" style={{ color: '#ef4444' }}>
                                            {problem.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                                        {problem.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2 px-5 pb-5 shrink-0">
                        {problems.map((_, i) => (
                            <div
                                key={i}
                                className="h-0.5 rounded-full transition-all duration-500"
                                style={{
                                    width: i === activeIndex ? '32px' : '12px',
                                    backgroundColor: i === activeIndex ? '#ef4444' : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── DESKTOP LAYOUT ── */}
                <div className="hidden lg:flex flex-col h-full pt-20 px-20">
                    {/* Static header */}
                    <div className="mb-8 shrink-0">
                        <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-4 font-mono">
                            EMOTIONS BEAT INTELLIGENCE
                        </p>
                        <h2 className="text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4">
                            <PriceTargetText>{`The math is easy.\nEmotional mastery isn't.`}</PriceTargetText>
                        </h2>
                        <div className="h-px w-full bg-white/10" />
                    </div>

                    {/* Animated card */}
                    <div className="relative overflow-hidden flex-1 min-h-0">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={`desktop-${activeIndex}`}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                className="flex flex-row gap-12 items-center h-full"
                            >
                                {/* Image */}
                                <div
                                    className="relative w-[55%] shrink-0 rounded-2xl overflow-hidden border border-white/10"
                                    style={{ aspectRatio: '4/3', maxHeight: '45vh' }}
                                >
                                    <AdminImage
                                        imageKey={problem.imageKey}
                                        className="w-full h-full"
                                        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        alt={problem.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                </div>

                                {/* Text */}
                                <div className="flex flex-col justify-center gap-6 flex-1 min-w-0">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-8xl font-black text-white/10 leading-none select-none">0{activeIndex + 1}</span>
                                        <h3 className="text-4xl font-black uppercase tracking-tight leading-tight" style={{ color: '#ef4444' }}>
                                            {problem.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed font-sans max-w-md">
                                        {problem.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2 mt-6 pb-6 shrink-0">
                        {problems.map((_, i) => (
                            <div
                                key={i}
                                className="h-0.5 rounded-full transition-all duration-500"
                                style={{
                                    width: i === activeIndex ? '32px' : '12px',
                                    backgroundColor: i === activeIndex ? '#ef4444' : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}