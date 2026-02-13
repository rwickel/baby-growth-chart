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
  DialogDescription,
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
  trigger?: React.ReactNode;
}

import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';

export function AddBabyDialog({ onAdd, language, trigger }: AddBabyDialogProps) {
  const { t } = useTranslation(language);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-xl border-white/40 bg-white/20 backdrop-blur-sm hover:bg-white/40 font-bold transition-all">
            <UserPlus className="h-4 w-4" />
            {t('addBaby')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <img src={boyImg} className="w-8 h-8 object-contain" alt="" />
              </div>
              {t('addBaby')}
            </DialogTitle>
            <DialogDescription className="font-medium text-slate-500 pt-1">
              {t('noBabiesDesc')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
          <div className="space-y-3">
            <Label htmlFor="baby-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('babyName')}</Label>
            <Input
              id="baby-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emma"
              className="h-14 text-lg font-bold rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all px-6"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('male')}/{t('female')}</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all",
                  gender === 'male'
                    ? "bg-baby-boy/10 border-baby-boy shadow-md"
                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                )}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-inner mb-1">
                  <img src={boyImg} alt="Boy" className="w-full h-full object-contain bg-white" />
                </div>
                <span className={cn("font-bold text-sm", gender === 'male' ? "text-baby-boy" : "text-slate-400")}>
                  {t('boy')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all",
                  gender === 'female'
                    ? "bg-baby-girl/10 border-baby-girl shadow-md"
                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                )}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-inner mb-1">
                  <img src={girlImg} alt="Girl" className="w-full h-full object-contain bg-white" />
                </div>
                <span className={cn("font-bold text-sm", gender === 'female' ? "text-baby-girl" : "text-slate-400")}>
                  {t('girl')}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('birthDate')}</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-14 w-full justify-start text-left font-bold rounded-2xl bg-slate-50 border-slate-100 hover:bg-white transition-all px-6',
                    !birthDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                  {birthDate ? format(birthDate, 'PPP') : <span>{t('pickDate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={(d) => {
                    setBirthDate(d);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-4"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 w-full mt-4">
            {t('addBaby')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
