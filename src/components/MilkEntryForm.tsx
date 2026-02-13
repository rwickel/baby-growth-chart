import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MilkEntry, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface MilkEntryFormProps {
    onSubmit: (entry: Omit<MilkEntry, 'id'>) => void;
    initialValues?: MilkEntry;
    onCancel?: () => void;
    isEditing?: boolean;
    settings: AppSettings;
}

export function MilkEntryForm({ onSubmit, initialValues, onCancel, isEditing, settings }: MilkEntryFormProps) {
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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card rounded-[2.5rem] p-8 space-y-8 border-none shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xl text-slate-800">
                    {isEditing ? t('editMilk') : t('addMilk')}
                </h3>
                {!isEditing && (
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-primary" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="date" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('date')}</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'h-14 w-full justify-start text-left font-bold rounded-2xl bg-white/50 border-white/40 hover:bg-white',
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
                    <Label htmlFor="time" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('time')}</Label>
                    <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-14 text-lg font-black rounded-2xl bg-white/50 border-white/40 focus:bg-white transition-all px-6"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="amount" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('amount')} (ml)</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="1"
                        min="0"
                        max="1000"
                        placeholder="120"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-14 text-lg font-black rounded-2xl bg-white/50 border-white/40 focus:bg-white transition-all px-6"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="note" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('note')}</Label>
                    <Input
                        id="note"
                        type="text"
                        placeholder="e.g., Breast milk"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="h-14 text-lg font-bold rounded-2xl bg-white/50 border-white/40 focus:bg-white transition-all px-6"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 flex-1 sm:flex-none">
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
}
