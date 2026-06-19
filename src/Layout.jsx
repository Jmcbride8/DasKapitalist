import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, FileText, TrendingUp, ChevronDown, Menu, X, User, Home as HomeIcon, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/Home', { replace: true });
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!isLoadingAuth && !isAuthenticated && !location.pathname.startsWith('/Dashboards')) {
            navigateToLogin();
        }
    }, [isLoadingAuth, isAuthenticated, location.pathname]);

    if (isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-black dark:border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated && !location.pathname.startsWith('/Dashboards')) return null;

    const navItems = [
        { name: 'Home', icon: HomeIcon, path: 'Home' },
        {
            name: 'Dashboards',
            icon: LayoutDashboard,
            path: 'Dashboards',
            isCollapsible: true,
            subItems: [
                { name: 'Track Record', tab: 'time' },
                { name: 'Streaks', tab: 'weekly' },
                { name: 'Edge', tab: 'ticker' },
                { name: 'Exposure', tab: 'open' }
            ]
        },
        { name: 'Summaries', icon: FileText, path: 'Summaries' },
        {
            name: 'Trades',
            icon: TrendingUp,
            path: 'Trades',
            isCollapsible: true,
            subItems: [
                { name: 'All Trades', path: 'Trades' },
                { name: 'Open Trades', path: 'QuickUpdate' }
            ]
        }
    ];

    const activeCls = 'bg-black text-white dark:bg-white/8 dark:text-white';
    const inactiveCls = 'text-black/40 hover:text-black hover:bg-black/5 dark:text-white/30 dark:hover:text-white/70 dark:hover:bg-white/5';
    const subInactiveCls = 'text-black/40 hover:text-black hover:bg-black/5 dark:text-white/30 dark:hover:text-white/70 dark:hover:bg-white/5';

    const NavItem = ({ item, onClick }) => {
        const Icon = item.icon;
        const isActive = currentPageName === item.path;

        if (item.isCollapsible) {
            return (
                <details className="group" open>
                    <summary className={`relative flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all font-black text-xs tracking-[0.15em] uppercase font-mono select-none ${isActive ? activeCls : inactiveCls}`}>
                        {item.subItems?.some(sub => {
                            const subPath = sub.tab ? `/${item.path}` : `/${sub.path}`;
                            const currentView = new URLSearchParams(location.search).get('view');
                            return sub.tab ? location.pathname === subPath && currentView === sub.tab : location.pathname === subPath;
                        }) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#10b981]" />}
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {item.name}
                        <ChevronDown className="w-3.5 h-3.5 ml-auto transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pl-2 space-y-0.5 mt-0.5 border-l border-black/10 dark:border-white/5 ml-5">
                        {item.subItems.map((subItem) => {
                            const subPath = subItem.tab ? `/${item.path}` : `/${subItem.path}`;
                            const subView = subItem.tab || null;
                            const currentView = new URLSearchParams(location.search).get('view');
                            const isSubActive = subItem.tab
                                ? location.pathname === subPath && currentView === subView
                                : location.pathname === subPath;
                            return (
                                <Link
                                    key={subItem.tab || subItem.path}
                                    to={createPageUrl(subItem.tab ? `${item.path}?view=${subItem.tab}` : subItem.path)}
                                    onClick={onClick}
                                    className={`block px-2 py-2 text-[10px] font-black tracking-[0.15em] uppercase font-mono transition-colors flex items-center gap-2 ${isSubActive ? 'text-black dark:text-[#10b981] bg-black/5 dark:bg-transparent' : subInactiveCls}`}
                                >
                                    {isSubActive && <span className="hidden dark:inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" />}
                                    {subItem.name}
                                </Link>
                            );
                        })}
                    </div>
                </details>
            );
        }

        return (
            <Link
                to={createPageUrl(item.path)}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${isActive ? activeCls : inactiveCls}`}
            >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.name}
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-stone-50 dark:bg-[#0d0f0e] flex-col md:flex-row font-mono">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-56 bg-white dark:bg-[#111413] border-r border-black/10 dark:border-white/5 flex-col">
                {/* Logo */}
                <div className="px-5 py-5 border-b border-black/10 dark:border-white/5">
                    <Link to="/">
                        <h1 className="text-lg font-black uppercase tracking-[0.15em] text-black dark:text-white font-mono leading-none">
                            Das<span style={{ color: '#10b981' }}>Kapitalist</span>
                        </h1>
                        <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-black/20 dark:text-white/20 mt-1">Options Tracking</p>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {navItems.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>

                {/* Bottom links + theme toggle */}
                <div className="px-3 py-3 border-t border-black/10 dark:border-white/5 space-y-0.5">
                    <Link
                        to={createPageUrl('Profile')}
                        className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${currentPageName === 'Profile' ? activeCls : inactiveCls}`}
                    >
                        <User className="w-4 h-4 flex-shrink-0" />
                        Profile
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to={createPageUrl('Admin')}
                            className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${currentPageName === 'Admin' ? activeCls : inactiveCls}`}
                        >
                            <Settings className="w-4 h-4 flex-shrink-0" />
                            Admin
                        </Link>
                    )}
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile & Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-white dark:bg-[#111413] border-b border-black/10 dark:border-white/5 px-4 py-3 flex items-center justify-between">
                    <Link to="/">
                        <h1 className="text-base font-black uppercase tracking-[0.15em] text-black dark:text-white font-mono">
                            Das<span style={{ color: '#10b981' }}>Kapitalist</span>
                        </h1>
                    </Link>
                    <div className="flex items-center gap-1">
                        <ThemeToggle iconOnly className="px-2 py-2" />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-[#111413] border-b border-black/10 dark:border-white/5 px-3 py-3 space-y-0.5 max-h-[calc(100vh-52px)] overflow-y-auto">
                        {navItems.map((item) => (
                            <NavItem key={item.name} item={item} onClick={() => setMobileMenuOpen(false)} />
                        ))}
                        <Link
                            to={createPageUrl('Profile')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${currentPageName === 'Profile' ? activeCls : inactiveCls}`}
                        >
                            <User className="w-4 h-4 flex-shrink-0" />
                            Profile
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to={createPageUrl('Admin')}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 transition-all font-black text-xs tracking-[0.15em] uppercase font-mono ${currentPageName === 'Admin' ? activeCls : inactiveCls}`}
                            >
                                <Settings className="w-4 h-4 flex-shrink-0" />
                                Admin
                            </Link>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}