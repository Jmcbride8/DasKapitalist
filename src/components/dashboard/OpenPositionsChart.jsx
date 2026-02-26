import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OpenPositionsChart({ trades }) {
    return (
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Open Positions</CardTitle>
                <p className="text-sm text-slate-500">Current open trades analysis</p>
            </CardHeader>
            <CardContent>
                <div className="h-96 flex items-center justify-center text-slate-400">
                    Chart coming soon
                </div>
            </CardContent>
        </Card>
    );
}