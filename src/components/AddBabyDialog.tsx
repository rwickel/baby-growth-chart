import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Gender, Language } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';

interface AddBabyDialogProps {
  onAdd: (name: string, gender: Gender, birthDate: string) => void;
  language: Language;
}

export function AddBabyDialog({ onAdd, language }: AddBabyDialogProps) {
  const { t } = useTranslation(language);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;
    
    onAdd(name.trim(), gender, format(birthDate, 'yyyy-MM-dd'));
    setName('');
    setGender('male');
    setBirthDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('addBaby')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            👶 {t('addBaby')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baby-name">{t('babyName')}</Label>
            <Input
              id="baby-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emma"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('male')}/{t('female')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={gender === 'male' ? 'default' : 'outline'}
                onClick={() => setGender('male')}
                className="flex-1"
              >
                👦 {t('boy')}
              </Button>
              <Button
                type="button"
                variant={gender === 'female' ? 'default' : 'outline'}
                onClick={() => setGender('female')}
                className="flex-1"
              >
                👧 {t('girl')}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('birthDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !birthDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, 'PPP') : t('pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            {t('addBaby')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
