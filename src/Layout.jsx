import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, FileText, TrendingUp, ChevronDown } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
    const navItems = [
        { 
            name: 'Dashboards', 
            icon: LayoutDashboard, 
            path: 'Dashboards',
            isCollapsible: true,
            subItems: [
                { name: 'Weekly Totals', tab: 'weekly' },
                { name: 'Ticker History', tab: 'ticker' },
                { name: 'Open Positions', tab: 'open' },
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
                { name: 'Main Trades', path: 'Trades' },
                { name: 'Quick Update', path: 'QuickUpdate' }
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-900">Positions Tracker</h1>
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

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}