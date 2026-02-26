import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

export default function TradeFilters({ filters, onFilterChange, trades }) {
    const uniqueAccounts = [...new Set(trades.map(t => t.account).filter(Boolean))];
    const uniqueTickers = [...new Set(trades.map(t => t.ticker).filter(Boolean))];
    const tradeTypes = ["Covered Call", "Cash Secured Put", "Long Call", "Long Put", "Naked Put", "Naked Call"];
    const closeTypes = ["Assigned", "Bought to Close", "Rolled", "Expired Worthless"];

    const hasActiveFilters = Object.values(filters).some(v => v && v !== 'all');

    const clearFilters = () => {
        onFilterChange({
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
    };

    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
            {hasActiveFilters && (
                <div className="flex justify-end mb-3">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                        <X className="w-3 h-3 mr-1" />
                        Clear All
                    </Button>
                </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Status</label>
                    <Select value={filters.status} onValueChange={(value) => onFilterChange({ ...filters, status: value })}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Account</label>
                    <Select value={filters.account} onValueChange={(value) => onFilterChange({ ...filters, account: value })}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            {uniqueAccounts.map(account => (
                                <SelectItem key={account} value={account}>{account}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Type</label>
                    <Select value={filters.type} onValueChange={(value) => onFilterChange({ ...filters, type: value })}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {tradeTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Ticker</label>
                    <Select value={filters.ticker} onValueChange={(value) => onFilterChange({ ...filters, ticker: value })}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tickers</SelectItem>
                            {uniqueTickers.sort().map(ticker => (
                                <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Close Type</label>
                    <Select value={filters.closeType} onValueChange={(value) => onFilterChange({ ...filters, closeType: value })}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {closeTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Open Date From</label>
                    <Input 
                        type="date"
                        value={filters.openDateFrom}
                        onChange={(e) => onFilterChange({ ...filters, openDateFrom: e.target.value })}
                        className="h-9 text-xs"
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Open Date To</label>
                    <Input 
                        type="date"
                        value={filters.openDateTo}
                        onChange={(e) => onFilterChange({ ...filters, openDateTo: e.target.value })}
                        className="h-9 text-xs"
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Close Date From</label>
                    <Input 
                        type="date"
                        value={filters.closeDateFrom}
                        onChange={(e) => onFilterChange({ ...filters, closeDateFrom: e.target.value })}
                        className="h-9 text-xs"
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Close Date To</label>
                    <Input 
                        type="date"
                        value={filters.closeDateTo}
                        onChange={(e) => onFilterChange({ ...filters, closeDateTo: e.target.value })}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
}