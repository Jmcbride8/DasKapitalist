import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const HERO_VARIANTS = [
    { key: 'hero_v1', label: 'Golden Hour', src: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/bb8f8b7f9_generated_image.png' },
    { key: 'hero_v2', label: 'Rooftop', src: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/ccac0410c_generated_image.png' },
    { key: 'hero_v3', label: 'Crosswalk', src: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/70af486b4_generated_image.png' },
    { key: 'hero_v4', label: 'Federal Hall', src: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/c9e78b778_generated_image.png' },
];

export default function HeroImagePicker({ onSelect }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState('hero_v1');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const user = await base44.auth.me();
                if (user?.role === 'admin') setIsAdmin(true);
            } catch {}
            try {
                const saved = await base44.entities.LandingImage.filter({ image_key: 'hero_bg_selected' });
                if (saved.length > 0) {
                    setSelectedKey(saved[0].image_url);
                    const variant = HERO_VARIANTS.find(v => v.key === saved[0].image_url);
                    if (variant) onSelect(variant.src);
                }
            } catch {}
            setLoading(false);
        })();
    }, []);

    const handleSelect = async (key) => {
        setSelectedKey(key);
        const variant = HERO_VARIANTS.find(v => v.key === key);
        if (variant) onSelect(variant.src);

        try {
            const existing = await base44.entities.LandingImage.filter({ image_key: 'hero_bg_selected' });
            if (existing.length > 0) {
                await base44.entities.LandingImage.update(existing[0].id, { image_url: key });
            } else {
                await base44.entities.LandingImage.create({ image_key: 'hero_bg_selected', image_url: key });
            }
        } catch {}
        setOpen(false);
    };

    if (!isAdmin || loading) return null;

    return (
        <div className="absolute bottom-6 right-6 z-30">
            {open && (
                <div className="absolute bottom-full right-0 mb-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-3 flex gap-2">
                    {HERO_VARIANTS.map(v => (
                        <button
                            key={v.key}
                            onClick={() => handleSelect(v.key)}
                            className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                                selectedKey === v.key ? 'border-[#C49A2C] ring-2 ring-[#C49A2C]/30' : 'border-white/20 hover:border-white/50'
                            }`}
                            title={v.label}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${v.src})` }}
                            />
                        </button>
                    ))}
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all text-xs font-bold font-mono"
            >
                {open ? '✕' : '⚙'}
            </button>
        </div>
    );
}