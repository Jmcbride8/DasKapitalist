import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

const TradeTypeVisualization = ({ type, direction }) => {
    return (
        <svg width="100%" height="120" viewBox="0 0 200 120" className="mt-2">
            {/* Grid background */}
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width="200" height="120" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="30" y1="100" x2="190" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            
            {/* Axis labels */}
            <text x="185" y="115" fontSize="10" fill="#64748b">Price</text>
            <text x="10" y="25" fontSize="10" fill="#64748b">P&L</text>
            
            {/* Breakeven line */}
            <line x1="30" y1="60" x2="190" y2="60" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,4" />
            
            {/* Profit/Loss lines based on type */}
            {direction === 'bull' && (
                <>
                  <path d="M 30 100 L 110 100 L 190 30" stroke="#10b981" strokeWidth="2.5" fill="none" />
                  <path d="M 110 100 L 110 85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="105" y="80" fontSize="9" fill="#64748b">Strike</text>
                </>
            )}
            {direction === 'bear' && (
                <>
                  <path d="M 30 30 L 110 100 L 190 100" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                  <path d="M 110 100 L 110 85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="105" y="80" fontSize="9" fill="#64748b">Strike</text>
                </>
            )}
            {direction === 'capped-bull' && (
                <>
                  <path d="M 30 100 L 90 100 L 150 50 L 190 50" stroke="#10b981" strokeWidth="2.5" fill="none" />
                  <path d="M 90 100 L 90 85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                  <path d="M 150 50 L 150 35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                </>
            )}
            {direction === 'unlimited-loss' && (
                <>
                  <path d="M 30 50 L 110 100 L 190 100" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                  <path d="M 110 100 L 110 85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="105" y="80" fontSize="9" fill="#64748b">Sold @</text>
                </>
            )}
            {direction === 'capped-profit' && (
                <>
                  <path d="M 30 100 L 110 50 L 190 50" stroke="#10b981" strokeWidth="2.5" fill="none" />
                  <path d="M 110 50 L 110 35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                </>
            )}
            {direction === 'simple-long' && (
                <>
                  <path d="M 30 100 L 190 30" stroke="#10b981" strokeWidth="2.5" fill="none" />
                </>
            )}
        </svg>
    );
};

export default function TradeLegendModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline"
                    size="icon"
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                    title="Trade Types Legend"
                >
                    <Info className="w-4 h-4" />
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
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
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
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
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