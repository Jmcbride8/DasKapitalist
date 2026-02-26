import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TimeComparisonsChart({ trades }) {
    return (
        <Card className="border-0 shadow-none bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Time Comparisons</CardTitle>
                <p className="text-sm text-slate-500">Performance over time periods</p>
            </CardHeader>
            <CardContent>
                <div className="h-96 flex items-center justify-center text-slate-400">
                    Chart coming soon
                </div>
            </CardContent>
        </Card>
    );
}