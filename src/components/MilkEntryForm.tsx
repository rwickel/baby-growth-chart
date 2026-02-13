import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MilkEntry, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MilkEntryFormProps {
    onSubmit: (entry: Omit<MilkEntry, 'id'>) => void;
    initialValues?: MilkEntry;
    onCancel?: () => void;
    isEditing?: boolean;
    settings: AppSettings;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    gender?: 'male' | 'female';
}

export function MilkEntryForm({ onSubmit, initialValues, onCancel, isEditing, settings, isOpen, onOpenChange, gender }: MilkEntryFormProps) {
    const { t } = useTranslation(settings.language);

    const initialDate = initialValues ? new Date(initialValues.date) : new Date();

    const [date, setDate] = useState<Date | undefined>(initialDate);
    const [time, setTime] = useState(format(initialDate, 'HH:mm'));
    const [amount, setAmount] = useState(initialValues?.amount.toString() || '');
    const [note, setNote] = useState(initialValues?.note || '');
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !amount) {
            toast.error(t('atLeastOneMetric'));
            return;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const combinedDate = new Date(date);
        combinedDate.setHours(hours);
        combinedDate.setMinutes(minutes);

        onSubmit({
            date: combinedDate.toISOString(),
            amount: parseFloat(amount),
            note: note.trim() || undefined,
        });

        if (!isEditing) {
            setAmount('');
            setNote('');
            if (onOpenChange) onOpenChange(false);
        }
    };

    const isBoy = gender === 'male';

    const formContent = (
        <form onSubmit={handleSubmit} className={cn("space-y-8", isEditing ? "" : "p-2")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="date" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">{t('date')}</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'h-14 w-full justify-start text-left font-bold rounded-2xl bg-slate-50/50 border-white/40 hover:bg-white transition-all',
                                    !date && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                                {date ? format(date, 'PPP') : <span>{t('pickDate')}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d);
                                    setCalendarOpen(false);
                                }}
                                initialFocus
                                className="p-4"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="time" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">{t('time')}</Label>
                    <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="h-14 text-lg font-black rounded-2xl bg-slate-50/50 border-white/40 focus:bg-white transition-all pl-14 pr-6"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="amount" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">{t('amount')} (ml)</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="1"
                        min="0"
                        max="1000"
                        placeholder="120"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-14 text-lg font-black rounded-2xl bg-slate-50/50 border-white/40 focus:bg-white transition-all px-6"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="note" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">{t('note')}</Label>
                    <Input
                        id="note"
                        type="text"
                        placeholder="e.g., Breast milk"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="h-14 text-lg font-bold rounded-2xl bg-slate-50/50 border-white/40 focus:bg-white transition-all px-6"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    className={cn(
                        "h-14 px-10 text-lg font-black rounded-2xl shadow-lg flex-1 transition-all active:scale-95 text-white border-none",
                        isBoy
                            ? "bg-baby-boy hover:bg-baby-boy/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-boy)/0.3)]"
                            : "bg-baby-girl hover:bg-baby-girl/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-girl)/0.3)]"
                    )}
                >
                    {isEditing ? t('saveChanges') : t('addMilk')}
                </Button>
                {isEditing && onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="h-14 px-8 rounded-2xl bg-white/50 border-white/40 font-bold">
                        {t('cancel')}
                    </Button>
                )}
            </div>
        </form>
    );

    if (isEditing) {
        return (
            <div className="kawaii-card p-8 bg-white/40">
                <h3 className="font-black text-xl text-slate-800 mb-8 flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center",
                        gender === 'male' ? "bg-baby-boy/10" : "bg-baby-girl/10"
                    )}>
                        <Footprints className={cn("h-5 w-5", gender === 'male' ? "text-baby-boy" : "text-baby-girl")} />
                    </div>
                    {t('editMilk')}
                </h3>
                {formContent}
            </div>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-lg">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center",
                            gender === 'male' ? "bg-baby-boy/10" : "bg-baby-girl/10"
                        )}>
                            <Plus className={cn("h-5 w-5", gender === 'male' ? "text-baby-boy" : "text-baby-girl")} />
                        </div>
                        {t('addMilk')}
                    </DialogTitle>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
}
