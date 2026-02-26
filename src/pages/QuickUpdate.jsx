import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Check, X, ArrowUp, ArrowDown } from 'lucide-react';

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

    const openTrades = sortedTrades.filter(t => t.status === 'Open');

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
        updateMutation.mutate({ id: tradeId, data });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const EditableCell = ({ trade, field, type = 'text' }) => {
        const isEditing = editingId === trade.id;
        const data = formData[trade.id] || {};
        const value = isEditing ? data[field] : trade[field];

        if (!isEditing) {
            return (
                <TableCell 
                    className="text-slate-600 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    onClick={() => startEdit(trade)}
                >
                    {type === 'number' && value ? `$${parseFloat(value).toFixed(2)}` : (value ? formatDate(value) : '-')}
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
                    autoFocus
                />
            </TableCell>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Quick Update Positions</h1>
                <p className="text-slate-500 mt-2">Update open positions: Status, Current Value, Close Date, Income Week, Close Type</p>
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
                                <TableHead onClick={() => handleSort('account')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Account<SortIcon field="account" /></TableHead>
                                <TableHead onClick={() => handleSort('ticker')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Ticker<SortIcon field="ticker" /></TableHead>
                                <TableHead onClick={() => handleSort('type')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Type<SortIcon field="type" /></TableHead>
                                <TableHead onClick={() => handleSort('status')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Status<SortIcon field="status" /></TableHead>
                                <TableHead onClick={() => handleSort('close_premium')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Current Value<SortIcon field="close_premium" /></TableHead>
                                <TableHead onClick={() => handleSort('close_date')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Close Date<SortIcon field="close_date" /></TableHead>
                                <TableHead onClick={() => handleSort('income_week')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Income Week<SortIcon field="income_week" /></TableHead>
                                <TableHead onClick={() => handleSort('close_type')} className="font-semibold text-slate-700 text-xs py-3 px-3 cursor-pointer hover:bg-slate-100">Close Type<SortIcon field="close_type" /></TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3 px-3 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {openTrades.map(trade => {
                                const isEditing = editingId === trade.id;
                                const data = formData[trade.id] || {};

                                return (
                                    <TableRow key={trade.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                                        <TableCell className="text-slate-600 text-xs py-3 px-3">{trade.account || '-'}</TableCell>
                                        <TableCell className="text-slate-900 font-semibold text-sm py-3 px-3">{trade.ticker}</TableCell>
                                        <TableCell className="text-slate-600 text-xs py-3 px-3">{trade.type}</TableCell>
                                        <TableCell className="py-3 px-3">
                                            {isEditing ? (
                                                <Select value={data.status || ''} onValueChange={(v) => handleChange(trade.id, 'status', v)}>
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Open">Open</SelectItem>
                                                        <SelectItem value="Closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className="text-xs text-slate-600">{trade.status}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-3">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.close_premium ?? ''}
                                                    onChange={(e) => handleChange(trade.id, 'close_premium', e.target.value)}
                                                    className="h-8 text-xs"
                                                    placeholder="0.00"
                                                />
                                            ) : (
                                                <span className="text-xs text-slate-600">{trade.close_premium ? `$${trade.close_premium.toFixed(2)}` : '-'}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-3">
                                            {isEditing ? (
                                                <Input
                                                    type="date"
                                                    value={data.close_date || ''}
                                                    onChange={(e) => handleChange(trade.id, 'close_date', e.target.value)}
                                                    className="h-8 text-xs"
                                                />
                                            ) : (
                                                <span className="text-xs text-slate-600">{trade.close_date ? formatDate(trade.close_date) : '-'}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-3">
                                            {isEditing ? (
                                                <Input
                                                    type="date"
                                                    value={data.income_week || ''}
                                                    onChange={(e) => handleChange(trade.id, 'income_week', e.target.value)}
                                                    className="h-8 text-xs"
                                                />
                                            ) : (
                                                <span className="text-xs text-slate-600">{trade.income_week ? formatDate(trade.income_week) : '-'}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-3">
                                            {isEditing ? (
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
                                            ) : (
                                                <span className="text-xs text-slate-600">{trade.close_type || '-'}</span>
                                            )}
                                        </TableCell>
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
                                                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => startEdit(trade)}>
                                                    Edit
                                                </Button>
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