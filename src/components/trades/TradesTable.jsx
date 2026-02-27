import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const [tableHeight, setTableHeight] = useState(500);
    const bottomScrollRef = useRef(null);
    const containerRef = useRef(null);


    useEffect(() => {
        setVisibleCount(20);
    }, [trades]);

    useEffect(() => {
        const updateTableHeight = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const availableHeight = window.innerHeight - rect.top - 20;
                setTableHeight(Math.max(300, availableHeight));
            }
        };

        updateTableHeight();
        window.addEventListener('resize', updateTableHeight);
        return () => window.removeEventListener('resize', updateTableHeight);
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
        // Default sort: status (Open first), then expiration date
        const aStatus = a.status || '';
        const bStatus = b.status || '';
        
        // Sort by status first: Open comes before Closed
        if (aStatus !== bStatus) {
            if (aStatus === 'Open') return -1;
            if (bStatus === 'Open') return 1;
            return aStatus.localeCompare(bStatus);
        }
        
        // Then sort by expiration date
        if (sortField && sortField !== 'status') {
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
        }
        
        // Default secondary sort by expiration date
        const aExp = a.expiration ? new Date(a.expiration).getTime() : Infinity;
        const bExp = b.expiration ? new Date(b.expiration).getTime() : Infinity;
        return aExp - bExp;
    });

    const visibleTrades = sortedTrades.slice(0, visibleCount);

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' 
            ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
            : <ArrowDown className="h-3 w-3 ml-1 inline" />;
    };



    return (
        <div ref={containerRef} className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
                ref={bottomScrollRef}
                onScroll={handleScroll}
                style={{ 
                    height: `${tableHeight}px`,
                    overflowX: 'scroll',
                    overflowY: 'auto',
                    width: '100%',
                    scrollbarGutter: 'stable'
                }}
                className="overflow-x-scroll"
            >
                <Table style={{ minWidth: '2000px' }}>
                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white' }}>
                        {/* Group header row */}
                        <TableRow className="bg-slate-100 border-b border-slate-300">
                            {/* action / # / status / account / type / ticker — no group label */}
                            <TableHead colSpan={6} className="text-xs py-0.5 px-1 text-center border-r border-slate-300"></TableHead>
                            {/* Position Open group */}
                            <TableHead colSpan={4} className="text-xs py-0.5 px-1 text-center font-bold text-slate-600 border-r border-slate-300 bg-blue-50">
                                Position Open
                            </TableHead>
                            {/* Position Close group */}
                            <TableHead colSpan={7} className="text-xs py-0.5 px-1 text-center font-bold text-slate-600 bg-emerald-50">
                                Position Close
                            </TableHead>
                        </TableRow>
                        {/* Column header row */}
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                             <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-0.5 text-center w-8"></TableHead>
                             <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 text-center border-l border-r border-slate-300">#</TableHead>
                             <TableHead onClick={() => handleSort('status')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-center w-16">
                                 Status<SortIcon field="status" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('account')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-left">
                                 Account<SortIcon field="account" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('type')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right">
                                 Type<SortIcon field="type" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('ticker')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right border-r border-slate-300">
                                 Ticker<SortIcon field="ticker" />
                             </TableHead>
                             {/* Position Open columns */}
                             <TableHead onClick={() => handleSort('open_date')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-blue-50/40">
                                 Open Date<SortIcon field="open_date" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('expiration')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-blue-50/40">
                                 Expiration<SortIcon field="expiration" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('strike_price')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-blue-50/40">
                                 Strike<SortIcon field="strike_price" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('open_premium')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-blue-50/40 border-r border-slate-300">
                                 Open Value<SortIcon field="open_premium" />
                             </TableHead>
                             {/* Position Close columns */}
                             <TableHead onClick={() => handleSort('close_date')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Close Date<SortIcon field="close_date" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('income_week')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Income Week<SortIcon field="income_week" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('close_premium')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Current Value<SortIcon field="close_premium" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('potential_yield')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Yield<SortIcon field="potential_yield" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('close_type')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Close Type<SortIcon field="close_type" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('collateral_gain')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
                                 Collateral Gain<SortIcon field="collateral_gain" />
                             </TableHead>
                             <TableHead onClick={() => handleSort('profit')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-1 px-1 cursor-pointer hover:bg-slate-100 text-right bg-emerald-50/40">
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
                            visibleTrades.map((trade, index) => {
                                const calculatedProfit = (trade.open_premium || 0) + (trade.close_premium || 0) + (trade.collateral_gain || 0);
                                return (
                                <TableRow key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-1 px-0.5">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-slate-100">
                                                    <MoreVertical className="h-3 w-3 text-slate-500" />
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
                                    <TableCell className="text-slate-500 text-xs py-1 px-1 text-center border-l border-r border-slate-300">{index + 1}</TableCell>
                                    <TableCell className="py-1 px-1 text-right">
                                        <Badge variant={trade.status === 'Closed' ? 'secondary' : 'default'} 
                                               className={`text-xs ${trade.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {trade.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{trade.account || '-'}</TableCell>
                                    <TableCell className="text-slate-700 font-medium text-xs py-1 px-1 text-right">{trade.type}</TableCell>
                                    <TableCell className="font-semibold text-slate-900 text-xs py-1 px-1 text-right">{trade.ticker}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatDate(trade.open_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatDate(trade.expiration)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatDate(trade.close_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatDate(trade.income_week)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{trade.close_type || '-'}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{trade.strike_price ? `$${trade.strike_price.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatCurrency(trade.open_premium)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatPercent(trade.potential_yield)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-1 px-1 text-right">{formatCurrency(trade.close_premium)}</TableCell>
                                    <TableCell className={`text-xs py-1 px-1 text-right ${(trade.collateral_gain || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(trade.collateral_gain)}</TableCell>
                                    <TableCell className={`font-semibold text-xs py-1 px-1 text-right ${calculatedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(calculatedProfit)}</TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}