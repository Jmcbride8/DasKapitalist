import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

export default function TradeLegendModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Info className="w-4 h-4" />
                    Trade Types
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
                        Trade Type Reference
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                            <div className="text-2xl">📈</div>
                            <div className="flex-1">
                                <p className="font-semibold text-emerald-900 text-sm mb-2">Buying Options</p>
                                <p className="text-xs text-emerald-700 mb-3 italic">Pay Premium = Rights</p>
                                <div className="space-y-2 text-xs text-slate-700">
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-600">•</span>
                                        <span><strong className="text-slate-900">Long Call</strong> — Right to buy at strike</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-600">•</span>
                                        <span><strong className="text-slate-900">Long Put</strong> — Right to sell at strike</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                            <div className="text-2xl">📉</div>
                            <div className="flex-1">
                                <p className="font-semibold text-blue-900 text-sm mb-2">Selling Options</p>
                                <p className="text-xs text-blue-700 mb-3 italic">Receive Premium = Obligations</p>
                                <div className="space-y-2 text-xs text-slate-700">
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span><strong className="text-slate-900">Covered Call</strong> — Sell obligation (with stock)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span><strong className="text-slate-900">Cash Secured Put</strong> — Buy obligation (with cash)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span><strong className="text-slate-900">Naked Call</strong> — Sell obligation (no stock)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span><strong className="text-slate-900">Naked Put</strong> — Buy obligation (no cash)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}