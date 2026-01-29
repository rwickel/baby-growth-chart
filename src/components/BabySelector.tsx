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

export function BabySelector({ babies, activeBabyId, onSelect, onDelete, language }: BabySelectorProps) {
  const { t } = useTranslation(language);

  if (babies.length === 0) {
    return null;
  }

  const activeBaby = babies.find(b => b.id === activeBabyId);

  return (
    <div className="flex items-center gap-2">
      <Select value={activeBabyId || ''} onValueChange={onSelect}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('selectBaby')}>
            {activeBaby && (
              <span className="flex items-center gap-2">
                {activeBaby.gender === 'male' ? '👦' : '👧'} {activeBaby.name}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {babies.map((baby) => (
            <SelectItem key={baby.id} value={baby.id}>
              <span className="flex items-center gap-2">
                {baby.gender === 'male' ? '👦' : '👧'} {baby.name}
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
