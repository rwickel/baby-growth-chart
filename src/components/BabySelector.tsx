import { Baby, Language } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BabySelectorProps {
  babies: Baby[];
  activeBabyId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  language: Language;
}

import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';

export function BabySelector({ babies, activeBabyId, onSelect, onDelete, language }: BabySelectorProps) {
  const { t } = useTranslation(language);

  if (babies.length === 0) {
    return null;
  }

  const activeBaby = babies.find(b => b.id === activeBabyId);

  return (
    <div className="flex items-center gap-2">
      <Select value={activeBabyId || ''} onValueChange={onSelect}>
        <SelectTrigger className="w-[180px] h-10 rounded-xl border-white/40 bg-white/20 backdrop-blur-sm focus:ring-primary/20 transition-all">
          <SelectValue placeholder={t('selectBaby')}>
            {activeBaby && (
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <div className="w-6 h-6 rounded-full bg-white overflow-hidden shadow-sm flex-shrink-0">
                  <img src={activeBaby.gender === 'male' ? boyImg : girlImg} alt="" className="w-full h-full object-contain bg-white" />
                </div>
                {activeBaby.name}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
          {babies.map((baby) => (
            <SelectItem key={baby.id} value={baby.id} className="rounded-xl focus:bg-primary/5 transition-colors my-1">
              <span className="flex items-center gap-2 font-bold">
                <div className="w-6 h-6 rounded-full bg-white overflow-hidden flex-shrink-0">
                  <img src={baby.gender === 'male' ? boyImg : girlImg} alt="" className="w-full h-full object-contain bg-white" />
                </div>
                {baby.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeBaby && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteBaby')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteBabyDesc')} {activeBaby.name}. {t('cannotUndo')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(activeBaby.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
