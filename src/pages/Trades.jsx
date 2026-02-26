import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import TradesTable from '@/components/trades/TradesTable';
import TradeForm from '@/components/trades/TradeForm';
import BulkUpload from '@/components/trades/BulkUpload';
import TradeFilters from '@/components/trades/TradeFilters';

export default function Trades() {
    const [showForm, setShowForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        account: 'all',
        type: 'all',
        ticker: 'all',
        openDateFrom: '',
        openDateTo: '',
        closeDateFrom: '',
        closeDateTo: '',
        closeType: 'all'
    });
    const queryClient = useQueryClient();

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

    const handleDelete = (id) => {
        if (window.confirm('Delete this trade?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredTrades = useMemo(() => {
        return trades.filter(trade => {
            if (filters.status !== 'all' && trade.status !== filters.status) return false;
            if (filters.account !== 'all' && trade.account !== filters.account) return false;
            if (filters.type !== 'all' && trade.type !== filters.type) return false;
            if (filters.ticker !== 'all' && trade.ticker !== filters.ticker) return false;
            if (filters.closeType !== 'all' && trade.close_type !== filters.closeType) return false;
            
            if (filters.openDateFrom && trade.open_date < filters.openDateFrom) return false;
            if (filters.openDateTo && trade.open_date > filters.openDateTo) return false;
            if (filters.closeDateFrom && trade.close_date < filters.closeDateFrom) return false;
            if (filters.closeDateTo && trade.close_date > filters.closeDateTo) return false;
            
            return true;
        });
    }, [trades, filters]);

    const stats = {
        totalProfit: trades.reduce((sum, t) => sum + (t.profit || 0), 0),
        realizedProfit: trades.filter(t => t.status === 'Closed').reduce((sum, t) => sum + (t.profit || 0), 0),
        unrealizedProfit: trades.filter(t => t.status === 'Open').reduce((sum, t) => sum + (t.profit || 0), 0),
        openTrades: trades.filter(t => t.status === 'Open').length,
        closedTrades: trades.filter(t => t.status === 'Closed').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-[1800px] mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Options Tracker</h1>
                        <p className="text-slate-500 mt-1">Track and analyze your options trades</p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setShowBulkUpload(true)}
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Bulk Upload
                        </Button>
                        <Button 
                            onClick={() => { setEditingTrade(null); setShowForm(true); }}
                            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Trade
                        </Button>
                    </div>
                </div>

                {/* Trade Type Legend */}
                <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 mb-6">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-emerald-900 mb-3">Trade Type Reference</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="font-semibold text-emerald-800 mb-2">📈 Buying Options (Pay Premium = Rights)</p>
                                <ul className="space-y-1 text-slate-700 ml-4">
                                    <li><strong>Long Call</strong> - Right to buy at strike price</li>
                                    <li><strong>Long Put</strong> - Right to sell at strike price</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-emerald-800 mb-2">📉 Selling Options (Receive Premium = Obligations)</p>
                                <ul className="space-y-1 text-slate-700 ml-4">
                                    <li><strong>Covered Call</strong> - Obligation to sell (backed by stock)</li>
                                    <li><strong>Cash Secured Put</strong> - Obligation to buy (backed by cash)</li>
                                    <li><strong>Naked Call</strong> - Obligation to sell (no stock backing)</li>
                                    <li><strong>Naked Put</strong> - Obligation to buy (no cash backing)</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Total Profit</p>
                                    <p className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${stats.totalProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                    <DollarSign className={`w-5 h-5 ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Realized</p>
                                    <p className={`text-2xl font-bold mt-1 ${stats.realizedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        ${stats.realizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-100">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Unrealized</p>
                                    <p className={`text-2xl font-bold mt-1 ${stats.unrealizedProfit >= 0 ? 'text-slate-600' : 'text-red-600'}`}>
                                        ${stats.unrealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-100">
                                    <TrendingDown className="w-5 h-5 text-slate-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Trades</p>
                                    <p className="text-2xl font-bold mt-1 text-slate-900">
                                        {stats.openTrades} <span className="text-sm font-normal text-slate-400">open</span> / {stats.closedTrades} <span className="text-sm font-normal text-slate-400">closed</span>
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-100">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Trades Table */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900">All Trades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TradeFilters filters={filters} onFilterChange={setFilters} trades={trades} />
                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400">Loading trades...</div>
                        ) : (
                            <TradesTable trades={filteredTrades} onEdit={handleEdit} onDelete={handleDelete} />
                        )}
                    </CardContent>
                </Card>

                {/* Trade Form Dialog */}
                <TradeForm 
                    open={showForm} 
                    onClose={() => { setShowForm(false); setEditingTrade(null); }}
                    onSave={handleSave}
                    trade={editingTrade}
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