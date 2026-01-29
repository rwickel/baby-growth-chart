import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { GrowthEntry, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { parseWeight, parseHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';

interface EntryFormProps {
  onSubmit: (entry: Omit<GrowthEntry, 'id'>) => void;
  initialValues?: GrowthEntry;
  onCancel?: () => void;
  isEditing?: boolean;
  settings: AppSettings;
}

export function EntryForm({ onSubmit, initialValues, onCancel, isEditing, settings }: EntryFormProps) {
  const { t } = useTranslation(settings.language);
  const [date, setDate] = useState<Date | undefined>(
    initialValues ? new Date(initialValues.date) : new Date()
  );
  const [weight, setWeight] = useState(initialValues?.weight.toString() || '');
  const [height, setHeight] = useState(initialValues?.height.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight || !height) return;

    // Convert to storage units (kg, cm)
    const weightInKg = parseWeight(parseFloat(weight), settings.weightUnit);
    const heightInCm = parseHeight(parseFloat(height), settings.heightUnit);

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
      <h3 className="font-bold text-lg flex items-center gap-2">
        {isEditing ? `✏️ ${t('editEntry')}` : `📝 ${t('addEntry')}`}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">{t('date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
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
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
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
            className="text-base"
            required
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
            className="text-base"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="gap-2">
          {isEditing ? t('saveChanges') : <><Plus className="h-4 w-4" /> {t('addEntry')}</>}
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
