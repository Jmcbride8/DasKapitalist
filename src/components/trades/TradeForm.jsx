import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TRADE_TYPES = ["Covered Call", "Cash Secured Put", "Long Call", "Long Put", "Naked Put", "Naked Call"];
const CLOSE_TYPES = ["Assigned", "Bought to Close", "Rolled", "Expired Worthless"];

export default function TradeForm({ open, onClose, onSave, trade }) {
    const [formData, setFormData] = useState({
        status: "Open",
        account: "",
        type: "Covered Call",
        ticker: "",
        open_date: "",
        expiration: "",
        strike_price: "",
        open_premium: "",
        collateral_start: "",
        potential_yield: "",
        close_premium: "",
        close_date: "",
        income_week: "",
        close_type: "",
        collateral_gain: "",
        days_open: "",
        profit: "",
        realized_yield: "",
        normalized_weekly: ""
    });

    useEffect(() => {
        if (trade) {
            setFormData({
                status: trade.status || "Open",
                account: trade.account || "",
                type: trade.type || "Covered Call",
                ticker: trade.ticker || "",
                open_date: trade.open_date || "",
                expiration: trade.expiration || "",
                strike_price: trade.strike_price || "",
                open_premium: trade.open_premium || "",
                collateral_start: trade.collateral_start || "",
                potential_yield: trade.potential_yield ? (trade.potential_yield * 100).toFixed(1) : "",
                close_premium: trade.close_premium || "",
                close_date: trade.close_date || "",
                income_week: trade.income_week || "",
                close_type: trade.close_type || "",
                collateral_gain: trade.collateral_gain || "",
                days_open: trade.days_open || "",
                profit: trade.profit || "",
                realized_yield: trade.realized_yield ? (trade.realized_yield * 100).toFixed(1) : "",
                normalized_weekly: trade.normalized_weekly ? (trade.normalized_weekly * 100).toFixed(1) : ""
            });
        } else {
            setFormData({
                status: "Open",
                account: "",
                type: "Covered Call",
                ticker: "",
                open_date: "",
                expiration: "",
                strike_price: "",
                open_premium: "",
                collateral_start: "",
                potential_yield: "",
                close_premium: "",
                close_date: "",
                income_week: "",
                close_type: "",
                collateral_gain: "",
                days_open: "",
                profit: "",
                realized_yield: "",
                normalized_weekly: ""
            });
        }
    }, [trade, open]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            strike_price: formData.strike_price ? parseFloat(formData.strike_price) : null,
            open_premium: formData.open_premium ? parseFloat(formData.open_premium) : null,
            collateral_start: formData.collateral_start ? parseFloat(formData.collateral_start) : null,
            potential_yield: formData.potential_yield ? parseFloat(formData.potential_yield) / 100 : null,
            close_premium: formData.close_premium ? parseFloat(formData.close_premium) : null,
            collateral_gain: formData.collateral_gain ? parseFloat(formData.collateral_gain) : null,
            days_open: formData.days_open ? parseInt(formData.days_open) : null,
            profit: formData.profit ? parseFloat(formData.profit) : null,
            realized_yield: formData.realized_yield ? parseFloat(formData.realized_yield) / 100 : null,
            normalized_weekly: formData.normalized_weekly ? parseFloat(formData.normalized_weekly) / 100 : null
        };
        onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {trade ? "Edit Trade" : "Add New Trade"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Account</Label>
                            <Input value={formData.account} onChange={(e) => handleChange("account", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TRADE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ticker *</Label>
                            <Input value={formData.ticker} onChange={(e) => handleChange("ticker", e.target.value.toUpperCase())} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Open Date *</Label>
                            <Input type="date" value={formData.open_date} onChange={(e) => handleChange("open_date", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Expiration</Label>
                            <Input type="date" value={formData.expiration} onChange={(e) => handleChange("expiration", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Strike Price ($)</Label>
                            <Input type="number" step="0.01" value={formData.strike_price} onChange={(e) => handleChange("strike_price", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Open Premium ($)</Label>
                            <Input type="number" step="0.01" value={formData.open_premium} onChange={(e) => handleChange("open_premium", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Collateral Start ($)</Label>
                            <Input type="number" step="0.01" value={formData.collateral_start} onChange={(e) => handleChange("collateral_start", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Potential Yield (%)</Label>
                            <Input type="number" step="0.1" value={formData.potential_yield} onChange={(e) => handleChange("potential_yield", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Close Premium ($)</Label>
                            <Input type="number" step="0.01" value={formData.close_premium} onChange={(e) => handleChange("close_premium", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Close Date</Label>
                            <Input type="date" value={formData.close_date} onChange={(e) => handleChange("close_date", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Income Week</Label>
                            <Input type="date" value={formData.income_week} onChange={(e) => handleChange("income_week", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Close Type</Label>
                            <Select value={formData.close_type || "none"} onValueChange={(v) => handleChange("close_type", v === "none" ? "" : v)}>
                                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {CLOSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Collateral Gain ($)</Label>
                            <Input type="number" step="0.01" value={formData.collateral_gain} onChange={(e) => handleChange("collateral_gain", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Days Open</Label>
                            <Input type="number" value={formData.days_open} onChange={(e) => handleChange("days_open", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Profit ($)</Label>
                            <Input type="number" step="0.01" value={formData.profit} onChange={(e) => handleChange("profit", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Realized Yield (%)</Label>
                            <Input type="number" step="0.1" value={formData.realized_yield} onChange={(e) => handleChange("realized_yield", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Normalized Weekly (%)</Label>
                            <Input type="number" step="0.1" value={formData.normalized_weekly} onChange={(e) => handleChange("normalized_weekly", e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                            {trade ? "Update Trade" : "Add Trade"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}