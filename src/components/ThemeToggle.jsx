import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function ThemeToggle({ iconOnly = false, className = '' }) {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono text-black/40 hover:text-black hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5 ${className}`}
        >
            {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
            {!iconOnly && (isDark ? 'Light' : 'Dark')}
        </button>
    );
}