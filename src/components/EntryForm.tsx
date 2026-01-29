import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { GrowthEntry } from '@/types/baby';

interface EntryFormProps {
  onSubmit: (entry: Omit<GrowthEntry, 'id'>) => void;
  initialValues?: GrowthEntry;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function EntryForm({ onSubmit, initialValues, onCancel, isEditing }: EntryFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialValues ? new Date(initialValues.date) : new Date()
  );
  const [weight, setWeight] = useState(initialValues?.weight.toString() || '');
  const [height, setHeight] = useState(initialValues?.height.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight || !height) return;

    onSubmit({
      date: format(date, 'yyyy-MM-dd'),
      weight: parseFloat(weight),
      height: parseFloat(height),
    });

    if (!isEditing) {
      setWeight('');
      setHeight('');
      setDate(new Date());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-lg flex items-center gap-2">
        {isEditing ? '✏️ Edit Entry' : '📝 Add New Entry'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
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
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
          <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            max="30"
            placeholder="e.g., 5.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="0"
            max="120"
            placeholder="e.g., 60"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="text-base"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="gap-2">
          {isEditing ? 'Save Changes' : <><Plus className="h-4 w-4" /> Add Entry</>}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
