import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { Check, X, ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown, BarChart3, Clock } from 'lucide-react';

// Returns days until expiration (negative = past), or null if no expiry
const getDaysToExpiry = (expirationStr) => {
    if (!expirationStr) return null;
    const expiry = new Date(expirationStr);
    expiry.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(expiry, today);
};

// Smooth color interpolation: green (15+) → yellow (7) → orange (3) → red (0)
const getDaysToExpiryStyle = (days) => {
    if (days === null) return {};
    if (days > 15) return { backgroundColor: 'transparent', color: '#64748b' };

    // Clamp
    const d = Math.max(0, Math.min(15, days));

    if (d >= 8) {
        // 15→8: transparent to yellow tint
        const t = (15 - d) / 7; // 0 at d=15, 1 at d=8
        const r = Math.round(255 * t + 0 * (1 - t));
        const g = Math.round(200 + 55 * (1 - t));
        const b = Math.round(0 + 0 * t);
        return { backgroundColor: `rgba(${r},${g},${b},${0.15 + t * 0.2})`, color: '#92400e', fontWeight: '600' };
    } else if (d >= 4) {
        // 7→4: yellow to orange
        const t = (7 - d) / 3;
        const r = 255;
        const g = Math.round(200 - 80 * t);
        return { backgroundColor: `rgba(${r},${g},0,${0.2 + t * 0.15})`, color: '#c2410c', fontWeight: '700' };
    } else {
        // 3→0: orange to red
        const t = (3 - d) / 3;
        const r = 255;
        const g = Math.round(120 - 120 * t);
        return { backgroundColor: `rgba(${r},${g},0,${0.3 + t * 0.2})`, color: '#b91c1c', fontWeight: '700' };
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        return format(new Date(dateStr), 'yyyy-MM-dd');
    } catch {
        return dateStr;
    }
};

const getNextFriday = () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilFriday = (5 - day + 7) % 7 || 7;
    const friday = new Date(today);
    friday.setDate(friday.getDate() + daysUntilFriday);
    return format(friday, 'yyyy-MM-dd');
};

export default function QuickUpdate() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterAccount, setFilterAccount] = useState('');
    const [filterTicker, setFilterTicker] = useState('');

    const { data: trades = [] } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list(),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Trade.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            setEditingId(null);
            setFormData({});
        },
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' 
            ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
            : <ArrowDown className="h-3 w-3 ml-1 inline" />;
    };

    const sortedTrades = [...trades].sort((a, b) => {
        if (!sortField) return 0;
        
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === 'string') {
            return sortDirection === 'asc' 
                ? aVal.localeCompare(bVal) 
                : bVal.localeCompare(aVal);
        }
        
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const openTrades = sortedTrades.filter(t => {
        if (t.status !== 'Open') return false;
        if (filterAccount && t.account !== filterAccount) return false;
        if (filterTicker && t.ticker !== filterTicker) return false;
        return true;
    });

    const allOpenTrades = trades.filter(t => t.status === 'Open');
    const uniqueAccounts = [...new Set(allOpenTrades.map(t => t.account).filter(Boolean))].sort();
    const uniqueTickers = [...new Set(allOpenTrades.map(t => t.ticker).filter(Boolean))].sort();

    const closePremiumTotal = openTrades.reduce((sum, t) => sum + (t.close_premium || 0), 0);

    // Trades expiring this calendar week (Mon–Sun)
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const expiringThisWeek = openTrades.filter(t => {
        if (!t.expiration) return false;
        const exp = new Date(t.expiration);
        return exp >= weekStart && exp <= weekEnd;
    }).length;

    const stats = {
        totalProfit: openTrades.reduce((sum, t) => sum + ((t.open_premium || 0) + (t.close_premium || 0) + (t.collateral_gain || 0)), 0),
        expiringThisWeek,
        closePremium: closePremiumTotal,
        openTrades: openTrades.length,
    };

    const startEdit = (trade) => {
        setEditingId(trade.id);
        setFormData({
            [trade.id]: {
                status: trade.status,
                close_premium: trade.close_premium || '',
                close_date: trade.close_date || '',
                income_week: trade.income_week || getNextFriday(),
                close_type: trade.close_type || '',
            }
        });
    };

    const handleChange = (tradeId, field, value) => {
        setFormData(prev => ({
            ...prev,
            [tradeId]: {
                ...prev[tradeId],
                [field]: value
            }
        }));
    };

    const handleSave = (tradeId) => {
        const data = formData[tradeId];
        const trade = trades.find(t => t.id === tradeId);
        const currentValue = parseFloat(data.close_premium) || 0;
        const openValue = trade?.open_premium || 0;
        const collateral = trade?.collateral_gain || 0;
        const profit = currentValue - openValue + collateral;
        updateMutation.mutate({ id: tradeId, data: { ...data, profit } });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const renderCell = (trade, field, type = 'text') => {
        const isEditing = editingId === trade.id;
        const data = formData[trade.id] || {};
        const value = isEditing ? data[field] : trade[field];

        if (!isEditing) {
            let displayValue = '-';
            if (value) {
                if (type === 'number') {
                    displayValue = `$${parseFloat(value).toFixed(2)}`;
                } else if (type === 'date') {
                    displayValue = formatDate(value);
                } else {
                    displayValue = value;
                }
            }
            return (
                <TableCell 
                    className="text-slate-600 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    onClick={() => startEdit(trade)}
                >
                    {displayValue}
                </TableCell>
            );
        }

        if (type === 'select' && field === 'status') {
            return (
                <TableCell className="py-3 px-3">
                    <Select value={data.status || ''} onValueChange={(v) => handleChange(trade.id, 'status', v)}>
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
            );
        }

        if (type === 'select' && field === 'close_type') {
            return (
                <TableCell className="py-3 px-3">
                    <Select value={data.close_type || ''} onValueChange={(v) => handleChange(trade.id, 'close_type', v)}>
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={null}>None</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="Bought to Close">Bought to Close</SelectItem>
                            <SelectItem value="Rolled">Rolled</SelectItem>
                            <SelectItem value="Expired Worthless">Expired Worthless</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
            );
        }

        return (
            <TableCell className="py-3 px-3">
                <Input
                    type={type}
                    step={type === 'number' ? '0.01' : undefined}
                    value={data[field] ?? ''}
                    onChange={(e) => handleChange(trade.id, field, e.target.value)}
                    className="h-8 text-xs"
                    placeholder={type === 'number' ? '0.00' : ''}
                />
            </TableCell>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Open Trades</h1>
                <p className="text-slate-500 mt-2">Update open positions: Status, Current Value, Close Date, Income Week, Close Type</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Open P&L</p>
                            <p className={`text-lg font-bold mt-0.5 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg ${stats.totalProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            <DollarSign className={`w-4 h-4 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Current Value</p>
                            <p className={`text-lg font-bold mt-0.5 ${stats.closePremium >= 0 ? 'text-slate-600' : 'text-red-600'}`}>
                                ${stats.closePremium.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100">
                            <TrendingDown className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Expiring This Week</p>
                            <p className={`text-lg font-bold mt-0.5 ${stats.expiringThisWeek > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                                {stats.expiringThisWeek} <span className="text-xs font-normal text-slate-400">trades</span>
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg ${stats.expiringThisWeek > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                            <Clock className={`w-4 h-4 ${stats.expiringThisWeek > 0 ? 'text-amber-600' : 'text-slate-500'}`} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Open Positions</p>
                            <p className="text-lg font-bold mt-0.5 text-slate-900">
                                {stats.openTrades} <span className="text-xs font-normal text-slate-400">positions</span>
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-100">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-3">
                <Select value={filterAccount} onValueChange={setFilterAccount}>
                    <SelectTrigger className="h-8 text-xs w-40">
                        <SelectValue placeholder="All Accounts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={null}>All Accounts</SelectItem>
                        {uniqueAccounts.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterTicker} onValueChange={setFilterTicker}>
                    <SelectTrigger className="h-8 text-xs w-40">
                        <SelectValue placeholder="All Tickers" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={null}>All Tickers</SelectItem>
                        {uniqueTickers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {openTrades.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-slate-400">
                        No open positions to update.
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-200">
                                <TableHead className="font-semibold text-slate-700 text-xs py-3 px-3 text-center border-r border-slate-300">#</TableHead>
                                <TableHead onClick={() => handleSort('expiration')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">DTE<SortIcon field="expiration" /></TableHead>
                                <TableHead onClick={() => handleSort('account')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Account<SortIcon field="account" /></TableHead>
                                <TableHead onClick={() => handleSort('ticker')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Ticker<SortIcon field="ticker" /></TableHead>
                                <TableHead onClick={() => handleSort('type')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Type<SortIcon field="type" /></TableHead>
                                <TableHead onClick={() => handleSort('status')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Status<SortIcon field="status" /></TableHead>
                                <TableHead onClick={() => handleSort('close_premium')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Current Value<SortIcon field="close_premium" /></TableHead>
                                <TableHead onClick={() => handleSort('close_date')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Close Date<SortIcon field="close_date" /></TableHead>
                                <TableHead onClick={() => handleSort('expiration')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Expiry Date<SortIcon field="expiration" /></TableHead>
                                <TableHead onClick={() => handleSort('income_week')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Income Week<SortIcon field="income_week" /></TableHead>
                                <TableHead onClick={() => handleSort('close_type')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Close Type<SortIcon field="close_type" /></TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3 px-3">Profit</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3 px-3 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {openTrades.map((trade, index) => {
                                const isEditing = editingId === trade.id;
                                const dte = getDaysToExpiry(trade.expiration);
                                const dteStyle = getDaysToExpiryStyle(dte);

                                return (
                                    <TableRow key={trade.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                                        <TableCell className="text-slate-500 text-xs py-3 px-3 text-center border-r border-slate-200">{index + 1}</TableCell>
                                        <TableCell className="text-xs py-3 px-3 text-center" style={dte !== null ? dteStyle : {}}>
                                            {dte !== null ? dte : '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-xs py-3 px-3">{trade.account || '-'}</TableCell>
                                        <TableCell className="text-slate-900 font-semibold text-sm py-3 px-3">{trade.ticker}</TableCell>
                                        <TableCell className="text-slate-600 text-xs py-3 px-3">{trade.type}</TableCell>
                                        {renderCell(trade, "status", "select")}
                                        {renderCell(trade, "close_premium", "number")}
                                        {renderCell(trade, "close_date", "date")}
                                        <TableCell className="text-slate-600 text-xs py-3 px-3">
                                            {trade.expiration ? formatDate(trade.expiration) : '-'}
                                        </TableCell>
                                        {renderCell(trade, "income_week", "date")}
                                        {renderCell(trade, "close_type", "select")}
                                        {(() => {
                                            const currentValue = isEditing ? parseFloat(formData[trade.id]?.close_premium) || 0 : (trade.close_premium || 0);
                                            const openValue = trade.open_premium || 0;
                                            const collateral = trade.collateral_gain || 0;
                                            const profit = currentValue - openValue + collateral;
                                            const hasData = trade.open_premium !== null && trade.open_premium !== undefined;
                                            return (
                                                <TableCell className={`text-xs py-3 px-3 font-semibold ${!hasData ? 'text-slate-400' : profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {hasData ? `$${profit.toFixed(2)}` : '-'}
                                                </TableCell>
                                            );
                                        })()}
                                        <TableCell className="py-3 px-3 text-center">
                                            {isEditing ? (
                                                <div className="flex gap-2 justify-center">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleSave(trade.id)}>
                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancel}>
                                                        <X className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">Click to edit</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}