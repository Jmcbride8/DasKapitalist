import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, CreditCard, Bell, Shield, LogOut, Save, Check, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

const PLANS = [
    {
        key: 'solo',
        name: 'Solo',
        price: '$50',
        period: '/mo',
        desc: 'Track every trade. Trust the data. Build your edge alone.',
        features: ['Unlimited trade logging', 'All 4 dashboards', 'CSV / bulk import', 'Single account'],
    },
    {
        key: 'ai',
        name: 'AI Enabled',
        price: '$100',
        period: '/mo',
        desc: 'AI co-pilot. Pattern recognition. Ruthlessly objective.',
        features: ['Everything in Solo', 'AI trade analysis', 'Pattern recognition', 'Priority support'],
        badge: 'Best Value',
    },
];

export default function Profile() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('account');
    const [form, setForm] = useState({ full_name: '', email: '' });
    const [saved, setSaved] = useState(false);
    const { themePreference, setPreference } = useTheme();

    useEffect(() => {
        base44.auth.me().then((u) => {
            setUser(u);
            setForm({ full_name: u?.full_name || '', email: u?.email || '' });
        }).catch(() => {});
    }, []);

    const handleSave = async () => {
        await base44.auth.updateMe({ full_name: form.full_name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { key: 'account', label: 'Account', icon: User },
        { key: 'subscription', label: 'Subscription', icon: CreditCard },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-[#0d0f0e] font-mono">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-black/10 dark:border-white/10 px-6 py-8">
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-black/30 dark:text-white/30 mb-2">Settings</p>
                <h1 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">Profile</h1>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar tabs */}
                    <div className="md:w-48 flex-shrink-0">
                        <nav className="space-y-0.5">
                            {tabs.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${
                                        activeTab === key ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 hover:text-black hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {label}
                                </button>
                            ))}
                            <div className="pt-4">
                                <button
                                    onClick={() => base44.auth.logout('/')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all font-black text-xs tracking-[0.15em] uppercase font-mono text-red-400 hover:text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 flex-shrink-0" />
                                    Log Out
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-6">

                        {/* ACCOUNT TAB */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-tight text-black dark:text-white mb-1">Account Info</h2>
                                    <div className="h-px w-8 bg-emerald-500 mb-6" />
                                </div>

                                {/* Avatar placeholder */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-black flex items-center justify-center">
                                        <span className="text-white font-black text-lg uppercase">
                                            {(form.full_name || 'U')[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-black dark:text-white">{form.full_name || '—'}</p>
                                        <p className="text-[10px] font-bold tracking-wider uppercase text-black/30 dark:text-white/30">{form.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            className="w-full border border-black/20 dark:border-white/20 px-3 py-2.5 text-sm font-mono text-black dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            disabled
                                            className="w-full border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm font-mono text-black/30 dark:text-white/30 bg-stone-50 dark:bg-zinc-800 cursor-not-allowed"
                                        />
                                        <p className="text-[9px] text-black/20 mt-1 uppercase tracking-wider">Email cannot be changed</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-1.5">Role</label>
                                    <span className="inline-block px-3 py-1 bg-black text-white text-[9px] font-black tracking-[0.25em] uppercase">
                                        {user?.role || 'user'}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-2">Theme Preference</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { key: 'light', icon: Sun, label: 'Light' },
                                            { key: 'dark', icon: Moon, label: 'Dark' },
                                            { key: 'system', icon: Monitor, label: 'System' }
                                        ].map(({ key, icon: Icon, label }) => (
                                            <button
                                                key={key}
                                                onClick={() => setPreference(key)}
                                                className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all ${
                                                    themePreference === key
                                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                        : 'border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 hover:border-black/20 dark:hover:border-white/20'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-[9px] font-black tracking-[0.15em] uppercase">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-black/30 dark:text-white/30 mt-2 uppercase tracking-wider">
                                        {themePreference === 'system' ? 'Auto-switches based on your device settings' : themePreference === 'dark' ? 'Always use dark mode' : 'Always use light mode'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-3">Theme Preference</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setPreference('light')}
                                            className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                                                themePreference === 'light'
                                                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                                    : 'border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 hover:border-black/40 dark:hover:border-white/40'
                                            }`}
                                        >
                                            <Sun className="w-5 h-5" />
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Light</span>
                                        </button>
                                        <button
                                            onClick={() => setPreference('dark')}
                                            className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                                                themePreference === 'dark'
                                                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                                    : 'border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 hover:border-black/40 dark:hover:border-white/40'
                                            }`}
                                        >
                                            <Moon className="w-5 h-5" />
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Dark</span>
                                        </button>
                                        <button
                                            onClick={() => setPreference('system')}
                                            className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                                                themePreference === 'system'
                                                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                                    : 'border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 hover:border-black/40 dark:hover:border-white/40'
                                            }`}
                                        >
                                            <Monitor className="w-5 h-5" />
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">System</span>
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-black/30 dark:text-white/30 mt-2 uppercase tracking-wider">
                                        {themePreference === 'system' ? 'Automatically adjusts based on your device settings' : themePreference === 'dark' ? 'Always use dark mode' : 'Always use light mode'}
                                    </p>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 font-black text-xs tracking-wider uppercase transition-all"
                                    style={{ backgroundColor: saved ? '#10b981' : '#000', color: '#fff' }}
                                >
                                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {saved ? 'Saved' : 'Save Changes'}
                                </button>
                            </div>
                        )}

                        {/* SUBSCRIPTION TAB */}
                        {activeTab === 'subscription' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-tight text-black dark:text-white mb-1">Subscription</h2>
                                    <div className="h-px w-8 bg-emerald-500 mb-6" />
                                </div>

                                <div className="p-4 border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-zinc-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 dark:text-white/40">Current Plan</p>
                                        <p className="text-lg font-black uppercase text-black dark:text-white mt-0.5">Free Trial</p>
                                    </div>
                                    <span className="text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 border border-black/20 dark:border-white/20 text-black/40 dark:text-white/40">Active</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {PLANS.map((plan) => (
                                        <div
                                            key={plan.key}
                                            className={`relative border p-5 transition-all cursor-pointer ${plan.key === 'ai' ? 'border-emerald-500/40' : 'border-black/15 dark:border-white/15'} dark:hover:border-white/30`}
                                        >
                                            {plan.badge && (
                                                <span className="absolute top-3 right-3 text-[8px] font-black tracking-[0.2em] uppercase px-2 py-1 text-black" style={{ backgroundColor: '#10b981' }}>
                                                    {plan.badge}
                                                </span>
                                            )}
                                            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-black/30 dark:text-white/30 mb-1">Tier</p>
                                            <h3 className="text-xl font-black uppercase text-black dark:text-white tracking-tight">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-1 mb-3">
                                                <span className="text-3xl font-black text-black dark:text-white">{plan.price}</span>
                                                <span className="text-xs text-black/30 dark:text-white/30 font-mono">{plan.period}</span>
                                            </div>
                                            <p className="text-xs text-black/50 dark:text-white/50 font-sans mb-4">{plan.desc}</p>
                                            <ul className="space-y-1.5 mb-5">
                                                {plan.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-black/50 dark:text-white/50">
                                                        <div className="w-1 h-1 bg-emerald-500 flex-shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                className="w-full py-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all"
                                                style={plan.key === 'ai'
                                                    ? { backgroundColor: '#10b981', color: '#000' }
                                                    : { border: '1px solid rgba(128,128,128,0.3)', color: 'inherit' }
                                                }
                                            >
                                                Select Plan
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-tight text-black dark:text-white mb-1">Notifications</h2>
                                    <div className="h-px w-8 bg-emerald-500 mb-6" />
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Weekly P&L Summary', desc: 'Email digest every Monday morning' },
                                        { label: 'Trade Expiration Alerts', desc: 'Notify when options are expiring within 7 days' },
                                        { label: 'Win Streak Milestones', desc: 'Alert when you hit a new streak record' },
                                        { label: 'New Feature Announcements', desc: 'Updates on new platform features' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 last:border-0">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-wider text-black dark:text-white">{item.label}</p>
                                                <p className="text-[10px] text-black/30 dark:text-white/30 font-sans mt-0.5">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-black/10 dark:bg-white/10 peer-checked:bg-emerald-500 transition-colors relative">
                                                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-zinc-200 transition-transform peer-checked:translate-x-4" />
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-tight text-black dark:text-white mb-1">Security</h2>
                                    <div className="h-px w-8 bg-emerald-500 mb-6" />
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-zinc-800">
                                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 dark:text-white/40 mb-0.5">Authentication</p>
                                        <p className="text-sm font-black text-black dark:text-white">Managed by Base44</p>
                                        <p className="text-[10px] font-sans text-black/30 dark:text-white/30 mt-1">Your login is secured via the Base44 authentication platform. Password resets and 2FA are managed through your login portal.</p>
                                    </div>

                                    <div className="p-4 border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-zinc-800">
                                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30 dark:text-white/40 mb-0.5">Account Created</p>
                                        <p className="text-sm font-black text-black dark:text-white">
                                            {user?.created_date ? new Date(user.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                                        </p>
                                    </div>

                                    <div className="p-4 border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20">
                                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400 mb-1">Danger Zone</p>
                                        <p className="text-xs font-sans text-black/40 dark:text-white/40 mb-3">Permanently delete your account and all associated trade data. This cannot be undone.</p>
                                        <button className="px-4 py-2 border border-red-400 text-red-500 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}