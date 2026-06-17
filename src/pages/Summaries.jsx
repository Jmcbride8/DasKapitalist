import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import SummaryTable from '@/components/trades/SummaryTable';
import KPICards from '@/components/trades/KPICards';

export default function Summaries() {
    const { user } = useAuth();
    const [selectedTypes, setSelectedTypes] = useState([]);
    const tradeTypes = ['Trade', 'Covered Call', 'Cash Secured Put', 'Long Call', 'Long Put', 'Naked Put', 'Naked Call'];
    
    const { data: trades = [] } = useQuery({
        queryKey: ['trades', user?.id],
        queryFn: () => base44.entities.Trade.filter({ created_by_id: user?.id }, '-open_date'),
        enabled: !!user?.id
    });

    const filteredTrades = useMemo(() => {
        if (selectedTypes.length === 0) return trades;
        return trades.filter(t => selectedTypes.includes(t.type));
    }, [trades, selectedTypes]);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Weekly Summary</h1>
                
                <div className="mb-6 flex flex-wrap gap-2">
                    {tradeTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedTypes(prev => 
                                prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                            )}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedTypes.includes(type)
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                
                <KPICards trades={filteredTrades} />
                <SummaryTable trades={filteredTrades} />
            </div>
        </div>
    );
}