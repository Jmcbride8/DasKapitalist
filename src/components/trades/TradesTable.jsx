import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Trash2, XCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return num < 0 ? `(${formatted})` : formatted;
};

const formatPercent = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value) * 100;
    if (isNaN(num)) return '-';
    return `${num.toFixed(1)}%`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        return format(new Date(dateStr), 'M/d/yyyy');
    } catch {
        return dateStr;
    }
};

export default function TradesTable({ trades, onEdit, onClose, onDelete }) {
    const [visibleCount, setVisibleCount] = useState(20);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const scrollContainerRef = useRef(null);
    const topScrollRef = useRef(null);
    const bottomScrollRef = useRef(null);

    useEffect(() => {
        setVisibleCount(20);
    }, [trades]);

    useEffect(() => {
        const topScroll = topScrollRef.current;
        const bottomScroll = bottomScrollRef.current;
        
        const syncScroll = (e) => {
            if (e.target === topScroll) {
                bottomScroll.scrollLeft = topScroll.scrollLeft;
            } else {
                topScroll.scrollLeft = bottomScroll.scrollLeft;
            }
        };

        topScroll?.addEventListener('scroll', syncScroll);
        bottomScroll?.addEventListener('scroll', syncScroll);

        return () => {
            topScroll?.removeEventListener('scroll', syncScroll);
            bottomScroll?.removeEventListener('scroll', syncScroll);
        };
    }, []);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && visibleCount < trades.length) {
            setVisibleCount(prev => Math.min(prev + 20, trades.length));
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedTrades = [...trades].sort((a, b) => {
        if (!sortField) return 0;
        
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'profit') {
            aVal = (a.open_premium || 0) + (a.close_premium || 0) + (a.collateral_gain || 0);
            bVal = (b.open_premium || 0) + (b.close_premium || 0) + (b.collateral_gain || 0);
        }
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === 'string') {
            return sortDirection === 'asc' 
                ? aVal.localeCompare(bVal) 
                : bVal.localeCompare(aVal);
        }
        
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const visibleTrades = sortedTrades.slice(0, visibleCount);

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' 
            ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
            : <ArrowDown className="h-3 w-3 ml-1 inline" />;
    };

    const tableRef = useRef(null);

    useEffect(() => {
        const topScroll = topScrollRef.current;
        const table = tableRef.current;
        
        if (topScroll && table) {
            const contentDiv = topScroll.querySelector('div');
            if (contentDiv) {
                contentDiv.style.width = `${table.scrollWidth}px`;
            }
        }
    }, [trades, visibleTrades]);

    return (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
                ref={topScrollRef}
                className="overflow-x-auto"
                style={{ height: '12px', overflowY: 'hidden' }}
            >
                <div style={{ height: '1px' }}></div>
            </div>
            <div 
                ref={bottomScrollRef}
                onScroll={handleScroll}
                className="overflow-x-auto max-h-[800px] overflow-y-auto"
            >
                <div ref={tableRef}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80">
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-center">Actions</TableHead>
                            <TableHead onClick={() => handleSort('status')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Status<SortIcon field="status" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('account')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Account<SortIcon field="account" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('type')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Type<SortIcon field="type" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('ticker')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Ticker<SortIcon field="ticker" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('open_date')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Open Date<SortIcon field="open_date" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('expiration')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Expiration<SortIcon field="expiration" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('strike_price')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Strike Price<SortIcon field="strike_price" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('open_premium')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Open<SortIcon field="open_premium" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('collateral_start')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Collateral Start<SortIcon field="collateral_start" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('potential_yield')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Potential Yield<SortIcon field="potential_yield" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('close_premium')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Latest Value<SortIcon field="close_premium" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('close_date')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Close Date<SortIcon field="close_date" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('income_week')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Income Week<SortIcon field="income_week" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('close_type')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Close Type<SortIcon field="close_type" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('collateral_gain')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Collateral Gain<SortIcon field="collateral_gain" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('profit')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-right cursor-pointer hover:bg-slate-100">
                                Profit<SortIcon field="profit" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={17} className="text-center py-12 text-slate-400">
                                    No trades yet. Add your first trade to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleTrades.map((trade) => {
                                const calculatedProfit = (trade.open_premium || 0) + (trade.close_premium || 0) + (trade.collateral_gain || 0);
                                return (
                                <TableRow key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100">
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem onClick={() => onEdit(trade)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                {trade.status === 'Open' && (
                                                    <DropdownMenuItem onClick={() => onClose(trade)}>
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Close
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => onDelete(trade.id)} className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <Badge variant={trade.status === 'Closed' ? 'secondary' : 'default'} 
                                               className={`text-xs ${trade.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {trade.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{trade.account || '-'}</TableCell>
                                    <TableCell className="text-slate-700 font-medium text-xs py-2">{trade.type}</TableCell>
                                    <TableCell className="font-semibold text-slate-900 text-xs py-2">{trade.ticker}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.expiration)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.strike_price)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.open_premium)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatCurrency(trade.collateral_start)}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-700 text-xs py-2">{formatPercent(trade.potential_yield)}</TableCell>
                                    <TableCell className={`text-right font-mono text-xs py-2 ${trade.close_premium < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.close_premium)}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.close_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.income_week)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{trade.close_type || '-'}</TableCell>
                                    <TableCell className={`text-right font-mono text-xs py-2 ${trade.collateral_gain > 0 ? 'text-emerald-600' : trade.collateral_gain < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(trade.collateral_gain)}
                                    </TableCell>
                                    <TableCell className={`text-right font-mono font-semibold text-xs py-2 ${calculatedProfit > 0 ? 'text-emerald-600' : calculatedProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {formatCurrency(calculatedProfit)}
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>
        </div>
    );
}