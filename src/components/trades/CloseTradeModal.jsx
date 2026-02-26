import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getNextFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    return friday.toISOString().split('T')[0];
};

export default function CloseTradeModal({ open, onClose, onSave, trade }) {
    const [formData, setFormData] = useState({
        latest_value: '',
        close_date: '',
        income_week: getNextFriday(),
        close_type: ''
    });

    useEffect(() => {
        if (trade) {
            setFormData({
                latest_value: trade.latest_value || '',
                close_date: trade.close_date || '',
                income_week: trade.income_week || getNextFriday(),
                close_type: trade.close_type || ''
            });
        } else {
            setFormData({
                latest_value: '',
                close_date: '',
                income_week: getNextFriday(),
                close_type: ''
            });
        }
    }, [trade, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            status: 'Closed',
            latest_value: formData.latest_value ? parseFloat(formData.latest_value) : null,
            close_date: formData.close_date || null,
            income_week: formData.income_week || null,
            close_type: formData.close_type || null
        };
        onSave(dataToSave);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Close Trade</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="latest_value">Latest Value</Label>
                        <Input
                            id="latest_value"
                            type="number"
                            step="0.01"
                            value={formData.latest_value}
                            onChange={(e) => setFormData({ ...formData, latest_value: e.target.value })}
                            placeholder="Enter latest value"
                        />
                    </div>

                    <div>
                        <Label htmlFor="close_date">Close Date</Label>
                        <Input
                            id="close_date"
                            type="date"
                            value={formData.close_date}
                            onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="income_week">Income Week</Label>
                        <Input
                            id="income_week"
                            type="date"
                            value={formData.income_week}
                            onChange={(e) => setFormData({ ...formData, income_week: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="close_type">Close Type</Label>
                        <Select value={formData.close_type} onValueChange={(value) => setFormData({ ...formData, close_type: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select close type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Bought to Close">Bought to Close</SelectItem>
                                <SelectItem value="Rolled">Rolled</SelectItem>
                                <SelectItem value="Expired Worthless">Expired Worthless</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                            Close Trade
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}