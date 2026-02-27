import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    const [showForm, setShowForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [closingTrade, setClosingTrade] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [filterAccount, setFilterAccount] = useState('');
    const [filterTicker, setFilterTicker] = useState('');
    const queryClient = useQueryClient();
    const tradeTypes = ['Trade', 'Covered Call', 'Cash Secured Put', 'Long Call', 'Long Put', 'Naked Put', 'Naked Call'];

    const { data: trades = [], isLoading } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
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
            return typeMatch && accountMatch && tickerMatch;
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-[1800px] mx-auto p-6 lg:p-8">
                {/* Header with Actions */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Trades</h1>
                        <p className="text-slate-500 mt-1">Track and analyze your trading positions</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <TradeLegendModal />
                        <Button 
                            onClick={() => setShowBulkUpload(true)}
                            variant="outline"
                            size="icon"
                            className="border-slate-300 text-slate-700 hover:bg-slate-100"
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
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Total Profit</p>
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
                                        <p className="text-xs text-slate-500 font-medium">Realized</p>
                                        <p className={`text-lg font-bold mt-0.5 ${stats.realizedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            ${stats.realizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-100">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Unrealized</p>
                                        <p className={`text-lg font-bold mt-0.5 ${stats.unrealizedProfit >= 0 ? 'text-slate-600' : 'text-red-600'}`}>
                                            ${stats.unrealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
                                        <p className="text-xs text-slate-500 font-medium">Trades</p>
                                        <p className="text-lg font-bold mt-0.5 text-slate-900">
                                            {stats.openTrades} <span className="text-xs font-normal text-slate-400">open</span> / {stats.closedTrades} <span className="text-xs font-normal text-slate-400">closed</span>
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>
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