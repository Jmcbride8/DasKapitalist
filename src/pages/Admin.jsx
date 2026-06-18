import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Upload, Loader2, Check, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IMAGE_SLOTS = [
    {
        section: 'Hero',
        slots: [
            { key: 'hero_bg', label: 'Hero Background', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/9dcbd0421_ChatGPTImageJun17202603_05_42PM.png' },
        ]
    },
    {
        section: 'Hero Presets',
        slots: [
            { key: 'hero_v1', label: 'Golden Hour', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/bb8f8b7f9_generated_image.png' },
            { key: 'hero_v2', label: 'Rooftop', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/ccac0410c_generated_image.png' },
            { key: 'hero_v3', label: 'Crosswalk', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/70af486b4_generated_image.png' },
            { key: 'hero_v4', label: 'Federal Hall', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/c9e78b778_generated_image.png' },
        ]
    },
    {
        section: 'The Problem Cards',
        slots: [
            { key: 'problem_1', label: 'Revenge Trading', defaultSrc: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=600&fit=crop' },
            { key: 'problem_2', label: 'No Track Record', defaultSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop' },
            { key: 'problem_3', label: 'Confirmation Bias', defaultSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop' },
            { key: 'problem_4', label: 'Edge Blindness', defaultSrc: 'https://images.unsplash.com/photo-1639322537228-f740dce6b4ab?w=800&h=600&fit=crop' },
        ]
    },
    {
        section: 'Take Control Section',
        slots: [
            { key: 'solution_bg', label: 'Solution Background', defaultSrc: 'https://media.base44.com/images/public/694b97feaa431cbfcfc8fd44/5fcd8a80e_clarity.jpg' },
        ]
    },
    {
        section: 'Know Your Lane Cards',
        slots: [
            { key: 'investor_card', label: 'Investor Card', defaultSrc: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&h=500&fit=crop' },
            { key: 'trader_card', label: 'Trader Card', defaultSrc: 'https://images.unsplash.com/photo-1598886221035-4b1e41547d04?w=800&h=500&fit=crop' },
        ]
    },
    {
        section: 'Arsenal / Tools Cards',
        slots: [
            { key: 'weapon_1', label: 'Track Record', defaultSrc: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop' },
            { key: 'weapon_2', label: 'Streaks', defaultSrc: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&h=500&fit=crop' },
            { key: 'weapon_3', label: 'Edge', defaultSrc: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop' },
            { key: 'weapon_4', label: 'Exposure', defaultSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop' },
        ]
    },
    {
        section: 'Final CTA',
        slots: [
            { key: 'cta_bg', label: 'CTA Background', defaultSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop' },
        ]
    },
];

// Also track which hero preset is currently selected
const HERO_SELECTED_KEY = 'hero_bg_selected';

function ImageSlotCard({ slot, record, onUploaded, isHeroSelected, onSelectHero }) {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [localUrl, setLocalUrl] = useState(record?.image_url || null);

    const displayUrl = localUrl || slot.defaultSrc;

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            if (record) {
                await base44.entities.LandingImage.update(record.id, { image_url: file_url });
            } else {
                await base44.entities.LandingImage.create({ image_key: slot.key, image_url: file_url });
            }
            setLocalUrl(file_url);
            onUploaded(slot.key, file_url);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
            {/* Image Preview */}
            <div className="relative h-40 bg-slate-100 overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${displayUrl})` }}
                />
                {isHeroSelected !== undefined && (
                    <div className="absolute top-2 left-2">
                        <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-full font-mono ${isHeroSelected ? 'bg-emerald-500 text-white' : 'bg-black/40 text-white/60'}`}>
                            {isHeroSelected ? '✓ Active' : 'Preset'}
                        </span>
                    </div>
                )}
                {localUrl && (
                    <div className="absolute top-2 right-2">
                        <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-full bg-emerald-500 text-white font-mono">Custom</span>
                    </div>
                )}
            </div>

            {/* Info + Actions */}
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-wider text-black font-mono">{slot.label}</p>
                    <p className="text-[10px] text-black/30 font-mono mt-0.5">{slot.key}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-black/20 text-[10px] font-black uppercase tracking-wider hover:bg-black hover:text-white transition-all font-mono rounded-md"
                    >
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploading ? 'Uploading…' : 'Upload'}
                    </button>
                    {onSelectHero && (
                        <button
                            onClick={() => onSelectHero(slot.key, displayUrl)}
                            disabled={isHeroSelected}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-wider transition-all font-mono rounded-md ${
                                isHeroSelected
                                    ? 'bg-emerald-500 text-white cursor-default'
                                    : 'bg-black text-white hover:bg-emerald-600'
                            }`}
                        >
                            <Check className="w-3 h-3" />
                            {isHeroSelected ? 'Active' : 'Set Active'}
                        </button>
                    )}
                </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
    );
}

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [records, setRecords] = useState({});
    const [heroSelectedKey, setHeroSelectedKey] = useState('hero_v1');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading && user && user.role !== 'admin') {
            navigate('/Home');
        }
    }, [user, loading]);

    useEffect(() => {
        (async () => {
            const all = await base44.entities.LandingImage.list();
            const map = {};
            all.forEach(r => { map[r.image_key] = r; });
            setRecords(map);
            if (map[HERO_SELECTED_KEY]) {
                setHeroSelectedKey(map[HERO_SELECTED_KEY].image_url);
            }
            setLoading(false);
        })();
    }, []);

    const handleUploaded = (key, url) => {
        setRecords(prev => ({
            ...prev,
            [key]: { ...(prev[key] || {}), image_key: key, image_url: url }
        }));
    };

    const handleSelectHero = async (key, src) => {
        setHeroSelectedKey(key);
        try {
            const existing = records[HERO_SELECTED_KEY];
            if (existing) {
                await base44.entities.LandingImage.update(existing.id, { image_url: key });
            } else {
                await base44.entities.LandingImage.create({ image_key: HERO_SELECTED_KEY, image_url: key });
            }
            setRecords(prev => ({
                ...prev,
                [HERO_SELECTED_KEY]: { ...(prev[HERO_SELECTED_KEY] || {}), image_key: HERO_SELECTED_KEY, image_url: key }
            }));
        } catch {}
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-black/30" />
            </div>
        );
    }

    if (user?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-stone-50 font-mono">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-black/30 mb-2">Admin</p>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-black">Landing Page Images</h1>
                    <p className="text-sm text-black/40 mt-2 font-sans">Upload and manage all images on the landing page. Changes take effect immediately.</p>
                </div>

                {IMAGE_SLOTS.map((section) => (
                    <div key={section.section} className="mb-12">
                        <div className="flex items-center gap-4 mb-5">
                            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-black">{section.section}</h2>
                            <div className="flex-1 h-px bg-black/10" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {section.slots.map((slot) => (
                                <ImageSlotCard
                                    key={slot.key}
                                    slot={slot}
                                    record={records[slot.key] || null}
                                    onUploaded={handleUploaded}
                                    isHeroSelected={section.section === 'Hero Presets' ? heroSelectedKey === slot.key : undefined}
                                    onSelectHero={section.section === 'Hero Presets' ? handleSelectHero : null}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}