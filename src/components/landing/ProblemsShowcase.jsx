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

        const getScrollTop = () =>
            scrollEl === window ? window.scrollY : scrollEl.scrollTop;

        const getElementTop = () => {
            if (scrollEl === window) {
                return section.getBoundingClientRect().top + window.scrollY;
            }
            // Relative to scrollEl
            return section.offsetTop;
        };

        const SCROLL_PER_CARD = window.innerHeight;

        const handleScroll = () => {
            const scrollTop = getScrollTop();
            const sectionTop = getElementTop();
            const scrolledIntoSection = scrollTop - sectionTop;

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
        handleScroll(); // run once on mount
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
                background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
            }}
        >
            <div
                className="sticky top-0 h-screen flex flex-col justify-start pt-16 lg:pt-20 px-6 lg:px-20 overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)' }}
            >
                {/* Static header */}
                <div className="mb-8">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-white mb-4 font-mono">
                        EMOTIONS BEAT INTELLIGENCE
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4">
                        <PriceTargetText>{`The math is easy.\nEmotional mastery isn't.`}</PriceTargetText>
                    </h2>
                    <div className="h-px w-full bg-white/10" />
                </div>

                {/* Animated card */}
                <div className="relative overflow-hidden flex-1 min-h-0">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={TRANSITION}
                            className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start lg:items-center h-full"
                        >
                            {/* Image */}
                            <div
                                className="relative w-full lg:w-[55%] shrink-0 rounded-2xl overflow-hidden border border-white/10"
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
                                    <span className="text-5xl font-black text-white/10 leading-none select-none">
                                        0{activeIndex + 1}
                                    </span>
                                    <h3
                                        className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight"
                                        style={{ color: '#ef4444' }}
                                    >
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
                <div className="flex gap-2 mt-6 pb-6">
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
        </section>
    );
}