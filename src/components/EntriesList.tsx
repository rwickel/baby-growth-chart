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
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-sm font-medium text-muted-foreground min-w-[100px]">
                  {format(parseISO(entry.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Weight className="h-4 w-4 text-primary" />
                  <span className="font-semibold">
                    {displayWeight(entry.weight, settings.weightUnit)} {weightLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Ruler className="h-4 w-4 text-accent" />
                  <span className="font-semibold">
                    {displayHeight(entry.height, settings.heightUnit)} {heightLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(entry.id)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
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
