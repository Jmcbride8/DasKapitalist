import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, FileText, TrendingUp, ChevronDown, Menu, X } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '') {
            navigate('/Dashboards?view=weekly', { replace: true });
        }
    }, [location.pathname]);
    const navItems = [
        { 
            name: 'Dashboards', 
            icon: LayoutDashboard, 
            path: 'Dashboards',
            isCollapsible: true,
            subItems: [
                { name: 'Streaks', tab: 'weekly' },
                { name: 'Edge', tab: 'ticker' },
                { name: 'Exposure', tab: 'open' },
                { name: 'Time Comparisons', tab: 'time' }
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

    return (
        <div className="flex h-screen bg-slate-50 flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 bg-white border-r border-slate-200 flex-col">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl" style={{background: 'linear-gradient(180deg, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 'bold', fontSize: '1.6rem'}}>☭</span>
                        <h1 className="text-xl font-bold text-slate-900">DasKapitalist</h1>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPageName === item.path;
                            
                            if (item.isCollapsible) {
                                return (
                                    <details key={item.name} className="group" open>
                                        <summary className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                            isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                            <ChevronDown className="w-4 h-4 ml-auto transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-6 space-y-1 mt-1">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.tab || subItem.path}
                                                    to={createPageUrl(subItem.tab ? `${item.path}?view=${subItem.tab}` : subItem.path)}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                );
                            } else {
                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.path)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            }
                        })}
                    </div>
                </nav>
            </div>

            {/* Mobile & Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span style={{background: 'linear-gradient(180deg, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 'bold', fontSize: '1.4rem'}}>☭</span>
                        <h1 className="text-lg font-bold text-slate-900">DasKapitalist</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 max-h-[calc(100vh-60px)] overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPageName === item.path;
                            
                            if (item.isCollapsible) {
                                return (
                                    <details key={item.name} className="group">
                                        <summary className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                            isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                            <ChevronDown className="w-4 h-4 ml-auto transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-6 space-y-1 mt-1">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.tab || subItem.path}
                                                    to={createPageUrl(subItem.tab ? `${item.path}?view=${subItem.tab}` : subItem.path)}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                );
                            } else {
                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.path)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            }
                        })}
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