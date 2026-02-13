import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Ruler, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { GrowthEntry, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { parseWeight, parseHeight, getWeightLabel, getHeightLabel, displayWeight, displayHeight } from '@/lib/unitConversions';
import { toast } from 'sonner';

interface EntryFormProps {
  onSubmit: (entry: Omit<GrowthEntry, 'id'>) => void;
  initialValues?: GrowthEntry;
  onCancel?: () => void;
  isEditing?: boolean;
  settings: AppSettings;
  gender?: 'male' | 'female';
}

export function EntryForm({ onSubmit, initialValues, onCancel, isEditing, settings, gender }: EntryFormProps) {
  const { t } = useTranslation(settings.language);
  const [date, setDate] = useState<Date | undefined>(
    initialValues ? new Date(initialValues.date) : new Date()
  );
  const [weight, setWeight] = useState(() =>
    initialValues?.weight ? displayWeight(initialValues.weight, settings.weightUnit) : ''
  );
  const [height, setHeight] = useState(() =>
    initialValues?.height ? displayHeight(initialValues.height, settings.heightUnit) : ''
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || (!weight && !height)) {
      // Show toast if both weight and height are missing
      toast.error(t('atLeastOneMetric'));
      return;
    }

    // Convert to storage units (kg, cm)
    const weightInKg = weight ? parseWeight(parseFloat(weight), settings.weightUnit) : 0;
    const heightInCm = height ? parseHeight(parseFloat(height), settings.heightUnit) : 0;

    onSubmit({
      date: format(date, 'yyyy-MM-dd'),
      weight: weightInKg,
      height: heightInCm,
    });

    if (!isEditing) {
      setWeight('');
      setHeight('');
      setDate(new Date());
    }
  };

  const weightLabel = getWeightLabel(settings.weightUnit);
  const heightLabel = getHeightLabel(settings.heightUnit);

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center transition-colors",
          gender === 'male' ? "bg-baby-boy/10" : "bg-baby-girl/10"
        )}>
          {isEditing ? (
            <Scale className={cn("h-5 w-5", gender === 'male' ? "text-baby-boy" : "text-baby-girl")} />
          ) : (
            <Ruler className={cn("h-5 w-5", gender === 'male' ? "text-baby-boy" : "text-baby-girl")} />
          )}
        </div>
        {isEditing ? t('editEntry') : t('addEntry')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="date" className="text-sm font-medium">{t('date')}</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-12 w-full justify-start text-left font-bold rounded-2xl bg-slate-50/50 border-white/40 hover:bg-white transition-all',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>{t('pickDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setCalendarOpen(false);
                }}
                initialFocus
                className="pointer-events-auto"
              />
              <div className="p-3 border-t border-border flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCalendarOpen(false)}
                >
                  {t('cancel')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">{t('weight')} ({weightLabel})</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            max={settings.weightUnit === 'lb' ? '66' : '30'}
            placeholder={settings.weightUnit === 'lb' ? 'e.g., 12.1' : 'e.g., 5.5'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-12 text-base font-bold rounded-2xl bg-slate-50/50 border-white/40 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">{t('height')} ({heightLabel})</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="0"
            max={settings.heightUnit === 'in' ? '48' : '120'}
            placeholder={settings.heightUnit === 'in' ? 'e.g., 23.6' : 'e.g., 60'}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="h-12 text-base font-bold rounded-2xl bg-slate-50/50 border-white/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className={cn(
            "gap-2 h-14 px-8 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 text-white border-none shrink-0",
            gender === 'male'
              ? "bg-baby-boy hover:bg-baby-boy/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-boy)/0.3)]"
              : "bg-baby-girl hover:bg-baby-girl/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-girl)/0.3)]"
          )}
        >
          {isEditing ? t('saveChanges') : <><Plus className="h-5 w-5 stroke-[3px]" /> {t('addEntry')}</>}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
      </div>
    </form>
  );
}
