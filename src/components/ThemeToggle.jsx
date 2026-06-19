import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function ThemeToggle({ iconOnly = false, className = '' }) {
    const { themePreference, setPreference } = useTheme();

    const cycleTheme = () => {
        if (themePreference === 'light') setPreference('dark');
        else if (themePreference === 'dark') setPreference('system');
        else setPreference('light');
    };

    const getIcon = () => {
        if (themePreference === 'system') return <Monitor className="w-4 h-4 flex-shrink-0" />;
        if (themePreference === 'dark') return <Sun className="w-4 h-4 flex-shrink-0" />;
        return <Moon className="w-4 h-4 flex-shrink-0" />;
    };

    const getLabel = () => {
        if (themePreference === 'system') return 'System';
        if (themePreference === 'dark') return 'Light';
        return 'Dark';
    };

    return (
        <button
            onClick={cycleTheme}
            title={`Current: ${themePreference}. Click to cycle theme.`}
            className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono text-black/40 hover:text-black hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5 ${className}`}
        >
            {getIcon()}
            {!iconOnly && getLabel()}
        </button>
    );
}