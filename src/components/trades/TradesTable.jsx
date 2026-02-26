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
    const [filters, setFilters] = useState({
        status: '',
        account: '',
        type: '',
        ticker: '',
        closeType: ''
    });
    const bottomScrollRef = useRef(null);
    const containerRef = useRef(null);

    // Extract unique values for dropdowns
    const uniqueAccounts = [...new Set(trades.map(t => t.account).filter(Boolean))];
    const uniqueTickers = [...new Set(trades.map(t => t.ticker).filter(Boolean))].sort();
    const tradeTypes = ["Trade", "Covered Call", "Cash Secured Put", "Long Call", "Long Put", "Naked Put", "Naked Call"];
    const closeTypes = ["Assigned", "Bought to Close", "Rolled", "Expired Worthless"];


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

    // Apply filters
    const filteredTrades = trades.filter(trade => {
        if (filters.status && trade.status !== filters.status) return false;
        if (filters.account && trade.account !== filters.account) return false;
        if (filters.type && trade.type !== filters.type) return false;
        if (filters.ticker && trade.ticker !== filters.ticker) return false;
        if (filters.closeType && trade.close_type !== filters.closeType) return false;
        return true;
    });

    const sortedTrades = [...filteredTrades].sort((a, b) => {
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



    return (
        <div ref={containerRef} className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
                ref={bottomScrollRef}
                onScroll={handleScroll}
                style={{ 
                    height: `${tableHeight}px`,
                    overflowX: 'auto',
                    overflowY: 'auto',
                    width: '100%'
                }}
            >
                <Table style={{ minWidth: '2000px' }}>
                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white' }}>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-center">Actions</TableHead>
                            <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 text-center">#</TableHead>
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
                            <TableHead onClick={() => handleSort('close_date')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Close Date<SortIcon field="close_date" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('close_type')} className="font-semibold text-slate-700 whitespace-nowrap text-xs py-2 cursor-pointer hover:bg-slate-100">
                                Close Type<SortIcon field="close_type" />
                            </TableHead>
                        </TableRow>
                        <TableRow className="bg-white border-b border-slate-200">
                            <TableHead className="py-1"></TableHead>
                            <TableHead className="py-1"></TableHead>
                            <TableHead className="py-1">
                                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                                    <SelectTrigger className="h-7 text-xs border-slate-300">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>All</SelectItem>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableHead>
                            <TableHead className="py-1">
                                <Select value={filters.account} onValueChange={(value) => setFilters({...filters, account: value})}>
                                    <SelectTrigger className="h-7 text-xs border-slate-300">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>All</SelectItem>
                                        {uniqueAccounts.map(acc => (
                                            <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableHead>
                            <TableHead className="py-1">
                                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                                    <SelectTrigger className="h-7 text-xs border-slate-300">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>All</SelectItem>
                                        {tradeTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableHead>
                            <TableHead className="py-1">
                                <Select value={filters.ticker} onValueChange={(value) => setFilters({...filters, ticker: value})}>
                                    <SelectTrigger className="h-7 text-xs border-slate-300">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>All</SelectItem>
                                        {uniqueTickers.map(ticker => (
                                            <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableHead>
                            <TableHead className="py-1">
                            </TableHead>
                            <TableHead className="py-1">
                                <Select value={filters.closeType} onValueChange={(value) => setFilters({...filters, closeType: value})}>
                                    <SelectTrigger className="h-7 text-xs border-slate-300">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>All</SelectItem>
                                        {closeTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    <TableCell className="text-slate-500 text-xs py-2 text-center">{index + 1}</TableCell>
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
                                    <TableCell className="text-slate-600 text-xs py-2">{formatDate(trade.close_date)}</TableCell>
                                    <TableCell className="text-slate-600 text-xs py-2">{trade.close_type || '-'}</TableCell>
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