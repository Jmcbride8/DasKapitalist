import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3, X, Upload, Filter } from 'lucide-react';
import TradesTable from '@/components/trades/TradesTable';
import TradeForm from '@/components/trades/TradeForm';
import CloseTradeModal from '@/components/trades/CloseTradeModal';
import BulkUpload from '@/components/trades/BulkUpload';
import TradeLegendModal from '@/components/trades/TradeLegendModal';

export default function Trades() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [closingTrade, setClosingTrade] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [filterAccount, setFilterAccount] = useState('');
    const [filterTicker, setFilterTicker] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const queryClient = useQueryClient();
    const tradeTypes = ['Trade', 'Covered Call', 'Cash Secured Put', 'Long Call', 'Long Put', 'Naked Put', 'Naked Call'];

    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades', user?.id],
        queryFn: () => base44.entities.Trade.filter({ created_by_id: user?.id }, '-open_date'),
        enabled: !!user?.id
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Trade.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            setShowForm(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Trade.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            setShowForm(false);
            setEditingTrade(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Trade.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] })
    });

    const handleSave = (data) => {
        if (editingTrade) {
            updateMutation.mutate({ id: editingTrade.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (trade) => {
        setEditingTrade(trade);
        setShowForm(true);
    };

    const handleClose = (trade) => {
        setClosingTrade(trade);
        setShowCloseModal(true);
    };

    const handleCloseSave = (data) => {
        if (closingTrade) {
            updateMutation.mutate({ 
                id: closingTrade.id, 
                data: { ...closingTrade, ...data }
            });
            setShowCloseModal(false);
            setClosingTrade(null);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this trade?')) {
            deleteMutation.mutate(id);
        }
    };



    const filteredTrades = useMemo(() => {
        return trades.filter(t => {
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(t.type);
            const accountMatch = !filterAccount || t.account === filterAccount;
            const tickerMatch = !filterTicker || t.ticker === filterTicker;
            const statusMatch = !filterStatus || t.status === filterStatus;
            return typeMatch && accountMatch && tickerMatch && statusMatch;
        });
    }, [trades, selectedTypes, filterAccount, filterTicker]);

    const uniqueAccounts = [...new Set(trades.map(t => t.account).filter(Boolean))].sort();
    const uniqueTickers = [...new Set(trades.map(t => t.ticker).filter(Boolean))].sort();

    const stats = {
        totalProfit: filteredTrades.reduce((sum, t) => sum + (t.profit || 0), 0),
        realizedProfit: filteredTrades.filter(t => t.status === 'Closed').reduce((sum, t) => sum + (t.profit || 0), 0),
        unrealizedProfit: filteredTrades.filter(t => t.status === 'Open').reduce((sum, t) => sum + (t.profit || 0), 0),
        openTrades: filteredTrades.filter(t => t.status === 'Open').length,
        closedTrades: filteredTrades.filter(t => t.status === 'Closed').length
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto p-6 lg:p-8">
                {/* Header with Actions */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">All Trades</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and analyze your trading positions</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <TradeLegendModal />
                        <Button 
                            onClick={() => setShowBulkUpload(true)}
                            size="icon"
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                            title="Bulk Upload"
                        >
                            <Upload className="w-4 h-4" />
                        </Button>
                        <Button 
                            onClick={() => { setEditingTrade(null); setShowForm(true); }}
                            size="icon"
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                            title="Add Trade"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Trades Table */}
                <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                            <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Profit</p>
                                        <p className={`text-lg font-bold mt-0.5 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${stats.totalProfit >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        <DollarSign className={`w-4 h-4 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Realized</p>
                                        <p className={`text-lg font-bold mt-0.5 ${stats.realizedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            ${stats.realizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unrealized</p>
                                        <p className={`text-lg font-bold mt-0.5 ${stats.unrealizedProfit >= 0 ? 'text-slate-600' : 'text-red-600'}`}>
                                            ${stats.unrealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800">
                                        <TrendingDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 border border-slate-200 dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trades</p>
                                        <p className="text-lg font-bold mt-0.5 text-slate-900 dark:text-white">
                                            {stats.openTrades} <span className="text-xs font-normal text-slate-400">open</span> / {stats.closedTrades} <span className="text-xs font-normal text-slate-400">closed</span>
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 mb-4 flex-wrap">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-8 text-xs w-36">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>All Statuses</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedTypes.length === 0 ? '' : selectedTypes[0]} onValueChange={(value) => {
                                if (value === '') {
                                    setSelectedTypes([]);
                                } else {
                                    setSelectedTypes(prev => 
                                        prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
                                    );
                                }
                            }}>
                                <SelectTrigger className="h-8 text-xs w-40">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>All Types</SelectItem>
                                    {tradeTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterAccount} onValueChange={setFilterAccount}>
                                <SelectTrigger className="h-8 text-xs w-40">
                                    <SelectValue placeholder="All Accounts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>All Accounts</SelectItem>
                                    {uniqueAccounts.map(a => (
                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterTicker} onValueChange={setFilterTicker}>
                                <SelectTrigger className="h-8 text-xs w-40">
                                    <SelectValue placeholder="All Tickers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>All Tickers</SelectItem>
                                    {uniqueTickers.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400">Loading trades...</div>
                        ) : (
                            <TradesTable trades={filteredTrades} onEdit={handleEdit} onClose={handleClose} onDelete={handleDelete} />
                        )}
                </div>

                {/* Trade Form Dialog */}
                <TradeForm 
                    open={showForm} 
                    onClose={() => { setShowForm(false); setEditingTrade(null); }}
                    onSave={handleSave}
                    trade={editingTrade}
                    accounts={uniqueAccounts}
                />

                {/* Close Trade Modal */}
                <CloseTradeModal
                    open={showCloseModal}
                    onClose={() => { setShowCloseModal(false); setClosingTrade(null); }}
                    onSave={handleCloseSave}
                    trade={closingTrade}
                />

                {/* Bulk Upload Dialog */}
                <BulkUpload
                    open={showBulkUpload}
                    onClose={() => setShowBulkUpload(false)}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ['trades'] })}
                />
            </div>
        </div>
    );
}