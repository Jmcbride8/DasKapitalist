import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themePreference, setThemePreference] = useState(() => {
        try {
            return localStorage.getItem('dk-theme-preference') || 'light';
        } catch {
            return 'light';
        }
    });

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const applyTheme = () => {
            let effectiveTheme = themePreference;
            if (themePreference === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                effectiveTheme = isDark ? 'dark' : 'light';
            }
            setTheme(effectiveTheme);
        };

        applyTheme();

        if (themePreference === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme();
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [themePreference]);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('dk-theme-preference', themePreference);
        } catch {}
    }, [theme]);

    const setPreference = (pref) => setThemePreference(pref);

    return (
        <ThemeContext.Provider value={{ theme, themePreference, setPreference }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}