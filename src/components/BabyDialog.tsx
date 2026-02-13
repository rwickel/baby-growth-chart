import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, UserPlus, Edit2 } from 'lucide-react';
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
import { Gender, Language, Baby } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { parseWeight, parseHeight } from '@/lib/unitConversions';

interface BabyDialogProps {
  onSubmit: (name: string, gender: Gender, birthDate: string, weight?: number, height?: number) => void;
  language: Language;
  trigger?: React.ReactNode;
  initialData?: Baby;
  title?: string;
  weightUnit?: 'kg' | 'lb';
  heightUnit?: 'cm' | 'in';
}

import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';

export function BabyDialog({ onSubmit, language, trigger, initialData, title, weightUnit = 'kg', heightUnit = 'cm' }: BabyDialogProps) {
  const { t } = useTranslation(language);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'male');
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    initialData?.birthDate ? parseISO(initialData.birthDate) : undefined
  );
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setGender(initialData.gender);
      setBirthDate(parseISO(initialData.birthDate));
      setWeight('');
      setHeight('');
    } else if (open && !initialData) {
      setName('');
      setGender('male');
      setBirthDate(undefined);
      setWeight('');
      setHeight('');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    const w = weight ? parseWeight(parseFloat(weight), weightUnit) : undefined;
    const h = height ? parseHeight(parseFloat(height), heightUnit) : undefined;

    onSubmit(name.trim(), gender, format(birthDate, 'yyyy-MM-dd'), w, h);
    if (!initialData) {
      setName('');
      setGender('male');
      setBirthDate(undefined);
      setWeight('');
      setHeight('');
    }
    setOpen(false);
  };

  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-xl border-white/40 bg-white/20 backdrop-blur-sm hover:bg-white/40 font-bold transition-all">
            {isEdit ? <Edit2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {title || (isEdit ? t('editEntry') : t('addBaby'))}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <img src={gender === 'male' ? boyImg : girlImg} className="w-8 h-8 object-contain" alt="" />
              </div>
              {title || (isEdit ? t('editEntry') : t('addBaby'))}
            </DialogTitle>
            <DialogDescription className="font-medium text-slate-500 pt-1">
              {isEdit ? t('updateBabyDesc') : t('noBabiesDesc')}
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
                  type="button"
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

          {!isEdit && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="space-y-3">
                <Label htmlFor="initial-weight" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('weight')} ({weightUnit})</Label>
                <Input
                  id="initial-weight"
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className="h-14 font-bold rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all px-6"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="initial-height" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('height')} ({heightUnit})</Label>
                <Input
                  id="initial-height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="0.0"
                  className="h-14 font-bold rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all px-6"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={cn(
              "h-14 text-lg font-black rounded-2xl shadow-lg w-full mt-4 transition-all active:scale-95 text-white",
              gender === 'male'
                ? "bg-baby-boy hover:bg-baby-boy/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-boy)/0.3)]"
                : "bg-baby-girl hover:bg-baby-girl/90 shadow-[0_10px_20px_-5px_hsl(var(--baby-girl)/0.3)]"
            )}
          >
            {isEdit ? t('saveChanges') : t('addBaby')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
