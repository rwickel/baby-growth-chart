import { Baby, Language, Gender } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface BabySelectorProps {
  babies: Baby[];
  activeBabyId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string, gender: Gender, birthDate: string, weight?: number, height?: number) => void;
  onUpdate: (id: string, updates: Partial<Baby>) => void;
  weightUnit?: 'kg' | 'lb';
  heightUnit?: 'cm' | 'in';
  language: Language;
}

import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';
import { BabyDialog } from './BabyDialog';
import { Edit2 } from 'lucide-react';

export function BabySelector({ babies, activeBabyId, onSelect, onDelete, onAdd, onUpdate, weightUnit = 'kg', heightUnit = 'cm', language }: BabySelectorProps) {
  const { t } = useTranslation(language);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-center gap-4 relative">
        {babies.map((baby) => {
          const isActive = baby.id === activeBabyId;
          const isBoy = baby.gender === 'male';

          return (
            <div key={baby.id} className="flex flex-col items-center gap-2 group relative">
              <div className="relative">
                <button
                  onClick={() => onSelect(baby.id)}
                  className={cn(
                    "relative w-20 h-20 rounded-full border-4 transition-all duration-500",
                    isActive
                      ? (isBoy ? "border-baby-boy scale-110 shadow-lg" : "border-baby-girl scale-110 shadow-lg")
                      : "border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <div className="w-full h-full rounded-full bg-white overflow-hidden p-1 shadow-inner">
                    <img
                      src={baby.gender === 'male' ? boyImg : girlImg}
                      alt={baby.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {isActive && (
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                      isBoy ? "bg-baby-boy" : "bg-baby-girl"
                    )}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>

                {/* Edit Button */}
                <div className="absolute -top-2 -left-2 z-10">
                  <BabyDialog
                    onSubmit={(name, gender, birthDate) => onUpdate(baby.id, { name, gender, birthDate })}
                    language={language}
                    initialData={baby}
                    weightUnit={weightUnit}
                    heightUnit={heightUnit}
                    trigger={
                      <button className="w-8 h-8 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-md hover:bg-slate-50 hover:border-slate-200 transition-all group/edit">
                        <Edit2 className="w-3.5 h-3.5 text-slate-300 group-hover/edit:text-slate-600 transition-colors" />
                      </button>
                    }
                  />
                </div>

                {/* Delete Button */}
                <div className="absolute -top-2 -right-2 z-10">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-8 h-8 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-md hover:bg-rose-50 hover:border-rose-100 transition-all group/del">
                        <Trash2 className="w-3.5 h-3.5 text-slate-300 group-hover/del:text-rose-400 transition-colors" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-slate-800">
                          {t('deleteBaby')}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium text-slate-500">
                          {t('deleteBabyDesc')} {baby.name}. {t('cannotUndo')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-8">
                        <AlertDialogCancel className="rounded-2xl h-12 px-6 font-bold">{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(baby.id)}
                          className="bg-destructive text-white hover:bg-destructive/90 rounded-2xl h-12 px-6 font-bold"
                        >
                          {t('delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="text-center">
                <span className={cn(
                  "text-sm font-black transition-colors block leading-none",
                  isActive ? "text-slate-800" : "text-slate-400"
                )}>
                  {baby.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {isBoy ? t('boy') : t('girl')}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Baby Button */}
        <div className="flex flex-col items-center gap-2 group relative">
          <div className="relative">
            <BabyDialog
              onSubmit={onAdd}
              language={language}
              weightUnit={weightUnit}
              heightUnit={heightUnit}
              trigger={
                <button className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center transition-all hover:bg-slate-50 hover:border-slate-300 hover:scale-105 group/add">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover/add:rotate-90 transition-all duration-500">
                    <Plus className="w-6 h-6 text-slate-400 group-hover/add:text-slate-600" />
                  </div>
                </button>
              }
            />
          </div>
          <div className="text-center">
            <span className="text-sm font-black text-slate-400">
              {t('addBaby')}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
              New
            </span>
          </div>
        </div>

        {/* Toggle link line (optional visual element) */}
        {babies.length > 0 && (
          <div className="absolute left-1/2 top-10 -translate-x-1/2 -z-10 w-full h-0.5 bg-slate-100 rounded-full" />
        )}
      </div>
    </div>
  );
}
