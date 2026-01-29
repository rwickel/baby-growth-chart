import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Weight, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GrowthEntry } from '@/types/baby';
import { EntryForm } from './EntryForm';
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
}

export function EntriesList({ entries, onUpdate, onDelete }: EntriesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4 animate-float">👶</div>
        <h3 className="font-bold text-lg mb-2">No entries yet</h3>
        <p className="text-muted-foreground">
          Start tracking your baby's growth by adding the first entry above!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        📋 Growth History
        <span className="text-sm font-normal text-muted-foreground">
          ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
        </span>
      </h3>

      <div className="space-y-3">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <EntryForm
              key={entry.id}
              initialValues={entry}
              isEditing
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
              <div className="flex items-center gap-6">
                <div className="text-sm font-medium text-muted-foreground min-w-[100px]">
                  {format(parseISO(entry.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Weight className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{entry.weight} kg</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Ruler className="h-4 w-4 text-accent" />
                  <span className="font-semibold">{entry.height} cm</span>
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
                      <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the entry from {format(parseISO(entry.date), 'MMM d, yyyy')}.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(entry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
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
