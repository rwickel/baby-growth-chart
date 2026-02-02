import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Weight, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GrowthEntry, AppSettings } from '@/types/baby';
import { EntryForm } from './EntryForm';
import { useTranslation } from '@/hooks/useTranslation';
import { displayWeight, displayHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';
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

interface EntriesListProps {
  entries: GrowthEntry[];
  onUpdate: (id: string, updates: Partial<Omit<GrowthEntry, 'id'>>) => void;
  onDelete: (id: string) => void;
  settings: AppSettings;
}

export function EntriesList({ entries, onUpdate, onDelete, settings }: EntriesListProps) {
  const { t } = useTranslation(settings.language);
  const [editingId, setEditingId] = useState<string | null>(null);

  const weightLabel = getWeightLabel(settings.weightUnit);
  const heightLabel = getHeightLabel(settings.heightUnit);

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4 animate-float">👶</div>
        <h3 className="font-bold text-lg mb-2">{t('noEntries')}</h3>
        <p className="text-muted-foreground">
          {t('noEntriesDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        📋 {t('growthHistory')}
        <span className="text-sm font-normal text-muted-foreground">
          ({entries.length} {entries.length === 1 ? t('entry') : t('entries')})
        </span>
      </h3>

      <div className="space-y-3">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <EntryForm
              key={entry.id}
              initialValues={entry}
              isEditing
              settings={settings}
              onSubmit={(updates) => {
                onUpdate(entry.id, updates);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={entry.id}
              className="group flex items-center justify-between p-3 bg-secondary/40 rounded-xl hover:bg-secondary/60 transition-colors gap-2"
            >
              <div className="grid grid-cols-[100px_1fr_1fr] items-center gap-2 flex-1 min-w-0">
                <div className="text-[11px] font-bold text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {format(parseISO(entry.date), 'MMM d, yy')}
                </div>

                <div className="flex items-center gap-1.5 text-foreground min-w-0">
                  <Weight className="h-3 w-3 text-primary/70 shrink-0" />
                  <div className="flex items-baseline gap-0.5 overflow-hidden">
                    <span className="text-sm font-bold tabular-nums">
                      {entry.weight > 0 ? displayWeight(entry.weight, settings.weightUnit) : "—"}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium lowercase">{weightLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-foreground min-w-0">
                  <Ruler className="h-3 w-3 text-accent/70 shrink-0" />
                  <div className="flex items-baseline gap-0.5 overflow-hidden">
                    <span className="text-sm font-bold tabular-nums">
                      {entry.height > 0 ? displayHeight(entry.height, settings.heightUnit) : "—"}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium lowercase">{heightLabel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(entry.id)}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive/60 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deleteEntry')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteEntryDesc')} {format(parseISO(entry.date), 'MMM d, yyyy')}.
                        {' '}{t('cannotUndo')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(entry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
