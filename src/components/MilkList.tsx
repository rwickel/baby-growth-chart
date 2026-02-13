import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Droplets, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MilkEntry, AppSettings, Gender } from '@/types/baby';
import { MilkEntryForm } from './MilkEntryForm';
import { useTranslation } from '@/hooks/useTranslation';
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

import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';

interface MilkListProps {
    entries: MilkEntry[];
    onUpdate: (id: string, updates: Partial<Omit<MilkEntry, 'id'>>) => void;
    onDelete: (id: string) => void;
    settings: AppSettings;
    gender?: Gender;
}

export function MilkList({ entries, onUpdate, onDelete, settings, gender }: MilkListProps) {
    const { t } = useTranslation(settings.language);
    const [editingId, setEditingId] = useState<string | null>(null);

    if (entries.length === 0) {
        const displayImg = gender === 'female' ? girlImg : boyImg;
        return (
            <div className="glass-card rounded-[2.5rem] p-12 text-center border-none shadow-xl flex flex-col items-center">
                <div className="w-24 h-24 mb-6 animate-float rounded-full overflow-hidden bg-white border-4 border-white shadow-inner relative">
                    <img src={displayImg} alt="Baby" className="w-full h-full object-contain bg-white" />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm text-xl relative z-10">🍼</div>
                </div>
                <h3 className="font-extrabold text-2xl mb-3 text-slate-800">{t('noMilkEntries')}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    {t('noEntriesDesc')}
                </p>
            </div>
        );
    }

    // Sort entries by date descending
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="glass-card rounded-[2.5rem] p-8 space-y-8 border-none shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-3">
                    {t('feedingHistory')}
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        {entries.length} {entries.length === 1 ? t('entry') : t('entries')}
                    </span>
                </h3>
            </div>

            <div className="space-y-4">
                {sortedEntries.map((entry) =>
                    editingId === entry.id ? (
                        <MilkEntryForm
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
                            className="group flex items-center justify-between p-5 bg-white/40 border border-white/60 rounded-[1.5rem] hover:bg-white hover:shadow-md transition-all gap-4"
                        >
                            <div className="flex flex-wrap items-center gap-6 flex-1 min-w-0">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                        {format(parseISO(entry.date), 'yyyy')}
                                    </span>
                                    <span className="text-sm font-black text-slate-700 whitespace-nowrap">
                                        {format(parseISO(entry.date), 'MMM d, HH:mm')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700 bg-white/50 px-4 py-2 rounded-2xl border border-white/40">
                                    <Droplets className="h-4 w-4 text-primary shrink-0" />
                                    <div className="flex items-baseline gap-1 overflow-hidden">
                                        <span className="text-base font-black tabular-nums">
                                            {entry.amount}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold lowercase tracking-wider">ml</span>
                                    </div>
                                </div>

                                {entry.note && (
                                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100 max-w-xs shrink-0">
                                        <Info className="h-3 w-3 shrink-0" />
                                        <span className="text-xs font-medium truncate italic">{entry.note}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingId(entry.id)}
                                    className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-primary transition-all"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-destructive transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl font-black">{t('deleteEntry')}</AlertDialogTitle>
                                            <AlertDialogDescription className="font-medium text-slate-500">
                                                {t('deleteMilkEntryDesc')} {format(parseISO(entry.date), 'MMM d, HH:mm')}.
                                                {' '}{t('cannotUndo')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-6">
                                            <AlertDialogCancel className="rounded-2xl font-bold h-12 px-6">{t('cancel')}</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(entry.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl font-bold h-12 px-6"
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
