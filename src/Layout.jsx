import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, FileText, TrendingUp, ChevronDown, Menu, X, Home as HomeIcon } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '') {
            navigate('/Home', { replace: true });
        }
    }, [location.pathname]);

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

    const activeCls = 'bg-black text-white';
    const inactiveCls = 'text-black/40 hover:text-black hover:bg-black/5';
    const subActiveCls = 'text-emerald-600 font-black';
    const subInactiveCls = 'text-black/35 hover:text-black';

    const NavItem = ({ item, onClick }) => {
        const Icon = item.icon;
        const isActive = currentPageName === item.path;

        if (item.isCollapsible) {
            return (
                <details key={item.name} className="group" open>
                    <summary className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all font-black text-xs tracking-[0.15em] uppercase font-mono select-none ${isActive ? activeCls : inactiveCls}`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {item.name}
                        <ChevronDown className="w-3.5 h-3.5 ml-auto transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pl-7 space-y-0.5 mt-0.5 border-l border-black/10 ml-5">
                        {item.subItems.map((subItem) => (
                            <Link
                                key={subItem.tab || subItem.path}
                                to={createPageUrl(subItem.tab ? `${item.path}?view=${subItem.tab}` : subItem.path)}
                                onClick={onClick}
                                className={`block py-2 text-[10px] font-black tracking-[0.15em] uppercase font-mono transition-colors ${subActiveCls}`}
                            >
                                {subItem.name}
                            </Link>
                        ))}
                    </div>
                </details>
            );
        }

        return (
            <Link
                key={item.name}
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
        <div className="flex h-screen bg-stone-50 flex-col md:flex-row font-mono">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-56 bg-white border-r border-black/10 flex-col">
                {/* Logo */}
                <div className="px-5 py-6 border-b border-black/10">
                    <Link to={createPageUrl('Home')}>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-black font-mono leading-none">
                            Das<span style={{ color: '#10b981' }}>Kapitalist</span>
                        </h1>
                        <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-black/20 mt-1">Options Tracking</p>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {navItems.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-black/10">
                    <div className="h-px w-8 bg-emerald-500 mb-2" />
                    <p className="text-[8px] font-bold tracking-[0.25em] uppercase text-black/15">
                        Built for traders.
                    </p>
                </div>
            </div>

            {/* Mobile & Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between">
                    <Link to={createPageUrl('Home')}>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-black font-mono">
                            Das<span style={{ color: '#10b981' }}>Kapitalist</span>
                        </h1>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-black/5 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-black/10 px-3 py-3 space-y-0.5 max-h-[calc(100vh-52px)] overflow-y-auto">
                        {navItems.map((item) => (
                            <NavItem key={item.name} item={item} onClick={() => setMobileMenuOpen(false)} />
                        ))}
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