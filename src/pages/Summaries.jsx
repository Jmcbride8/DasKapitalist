import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import SummaryTable from '@/components/trades/SummaryTable';
import KPICards from '@/components/trades/KPICards';

export default function Summaries() {
    const { data: trades = [] } = useQuery({
        queryKey: ['trades'],
        queryFn: () => base44.entities.Trade.list('-open_date')
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-6xl mx-auto p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Weekly Summary</h1>
                <KPICards trades={trades} />
                <SummaryTable trades={trades} />
            </div>
        </div>
    );
}