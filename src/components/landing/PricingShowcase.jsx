import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const tiers = [
    {
        num: 'TIER 01',
        name: 'Solo',
        price: '$50',
        per: '/mo',
        desc: 'Track every trade. Trust the data. Build your edge alone.',
        badge: null,
        image: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/e03c45339_Solo3.png',
        cta: 'Get Started',
        borderColor: 'rgba(255,255,255,0.12)',
        ctaStyle: { border: '1px solid rgba(255,255,255,0.3)', color: '#fff', background: 'transparent' },
        ctaHover: 'rgba(255,255,255,0.1)',
        gradientEnd: 'rgba(0,0,0,0.92)',
    },
    {
        num: 'TIER 02',
        name: 'AI Oracle',
        price: '$100',
        per: '/mo',
        desc: 'Your guide on the path to mastery. Insights, patterns, and hard truths.',
        badge: 'BEST VALUE',
        image: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/51af6d8d3_Sage2.png',
        cta: 'Enlist the Oracle',
        borderColor: 'rgba(16,185,129,0.25)',
        ctaStyle: { background: '#10b981', color: '#000' },
        ctaHover: '#34d399',
        gradientEnd: 'rgba(2,20,12,0.95)',
    },
];

const TRANSITION = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] };

function getScrollParent(el) {
    if (!el) return window;
    const style = getComputedStyle(el);
    const overflow = style.overflow + style.overflowY + style.overflowX;
    if (/auto|scroll/.test(overflow)) return el;
    return getScrollParent(el.parentElement);
}

export default function PricingShowcase({ onNavigate }) {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [hovered, setHovered] = useState(false);

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
            const index = Math.min(Math.floor(scrolledIntoSection / SCROLL_PER_CARD), tiers.length - 1);
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

    const tier = tiers[activeIndex];

    return (
        <>
            {/* ── MOBILE: scroll-pinned ── */}
            <section
                ref={sectionRef}
                className="relative md:hidden"
                style={{ height: `calc(100vh * ${tiers.length + 0.5})`, background: '#050505' }}
            >
                <div className="sticky top-0 h-screen flex flex-col overflow-hidden" style={{ background: '#050505' }}>
                    {/* Header */}
                    <div className="px-5 pt-10 pb-3 shrink-0">
                        <p className="text-[10px] font-bold tracking-[0.35em] uppercase font-mono mb-2" style={{ color: '#10b981' }}>PRICING</p>
                        <h2 className="text-3xl font-black uppercase leading-[0.92] tracking-tighter text-white">Get Serious.</h2>
                        <p className="text-white/50 font-sans text-sm mt-1">Find Your Edge. Fight Unfair.</p>
                    </div>

                    {/* Animated card */}
                    <div className="relative flex-1 min-h-0 mx-5 mb-5 rounded-2xl overflow-hidden" style={{ border: `1px solid ${tier.borderColor}` }}>
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
                                {/* BG image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${tier.image})` }}
                                />
                                {/* Gradient */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 45%, ${tier.gradientEnd} 100%)` }}
                                />
                                {/* Badge */}
                                {tier.badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full text-black" style={{ backgroundColor: '#10b981' }}>
                                            {tier.badge}
                                        </span>
                                    </div>
                                )}
                                {/* Content overlaid at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase font-mono mb-1 text-white/50">{tier.num}</p>
                                    <h3 className="text-5xl font-black uppercase text-white tracking-tight mb-1">{tier.name}</h3>
                                    <div className="mb-3">
                                        <span className="text-3xl font-black text-white">{tier.price}</span>
                                        <span className="text-white/40 font-mono text-sm ml-1">{tier.per}</span>
                                    </div>
                                    <p className="text-white/80 font-sans text-sm mb-5">{tier.desc}</p>
                                    <button
                                        onClick={() => onNavigate('/Trades')}
                                        onMouseEnter={(e) => { if (tier.ctaHover && !tier.ctaStyle.border) e.currentTarget.style.backgroundColor = tier.ctaHover; }}
                                        onMouseLeave={(e) => { if (!tier.ctaStyle.border) e.currentTarget.style.backgroundColor = tier.ctaStyle.background; }}
                                        className="w-full py-3.5 font-black text-sm tracking-wider uppercase transition-all rounded-md"
                                        style={tier.ctaStyle}
                                    >
                                        {tier.cta}
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2 px-5 pb-5 shrink-0">
                        {tiers.map((_, i) => (
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

            {/* ── DESKTOP: original grid ── */}
            <section className="hidden md:block py-32 px-6 lg:px-20" style={{ background: '#050505' }}>
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.35em] uppercase mb-8 font-mono text-center" style={{ color: '#10b981' }}>PRICING</p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.92] tracking-tighter mb-4 text-center text-white">Get Serious.</h2>
                    <p className="text-center text-white font-sans mb-16 text-base">Find Your Edge. Fight Unfair.</p>
                    <div className="grid md:grid-cols-2 gap-6 items-stretch">
                        {tiers.map((t, i) => (
                            <div
                                key={i}
                                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                                style={{ minHeight: '560px', border: `1px solid ${t.borderColor}` }}
                            >
                                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-125" style={{ backgroundImage: `url(${t.image})` }} />
                                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, ${t.gradientEnd} 100%)` }} />
                                {t.badge && (
                                    <div className="absolute top-6 right-6 z-10">
                                        <span className="text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full text-black" style={{ backgroundColor: '#10b981' }}>{t.badge}</span>
                                    </div>
                                )}
                                <div className="relative z-10 flex flex-col justify-end h-full p-8" style={{ minHeight: '560px' }}>
                                    <p className="text-xs font-bold tracking-[0.3em] uppercase font-mono mb-2" style={{ color: i === 1 ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.5)' }}>{t.num}</p>
                                    <h3 className="text-6xl font-black uppercase text-white tracking-tight mb-1">{t.name}</h3>
                                    <div className="mb-5">
                                        <span className="text-4xl font-black text-white">{t.price}</span>
                                        <span className="font-mono text-sm ml-2" style={{ color: i === 1 ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.4)' }}>{t.per}</span>
                                    </div>
                                    <p className="text-white font-sans text-sm mb-6 max-w-xs">{t.desc}</p>
                                    <button
                                        onClick={() => onNavigate('/Trades')}
                                        className="w-full py-3.5 font-black text-sm tracking-wider uppercase transition-all rounded-md"
                                        style={t.ctaStyle}
                                        onMouseEnter={(e) => { if (t.ctaHover && !t.ctaStyle.border) e.currentTarget.style.backgroundColor = t.ctaHover; else if (t.ctaStyle.border) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = t.ctaStyle.background || 'transparent'; }}
                                    >
                                        {t.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}