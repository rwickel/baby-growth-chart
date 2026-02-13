import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Droplets, Info, Moon } from 'lucide-react';
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
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm relative z-10 border border-slate-100">
                        <Moon className="h-5 w-5 text-indigo-300" />
                    </div>
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
        <div className="glass-card rounded-[2rem] p-4 lg:p-6 space-y-6 border-none shadow-lg">
            <div className="flex items-center justify-between gap-4">
                <h3 className="font-extrabold text-lg text-slate-800">
                    {t('feedingHistory')}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-widest flex-shrink-0">
                    {entries.length} {entries.length === 1 ? t('entry') : t('entries')}
                </span>
            </div>

            <div className="space-y-3">
                {sortedEntries.map((entry) =>
                    editingId === entry.id ? (
                        <MilkEntryForm
                            key={entry.id}
                            initialValues={entry}
                            isEditing
                            settings={settings}
                            gender={gender}
                            onSubmit={(updates) => {
                                onUpdate(entry.id, updates);
                                setEditingId(null);
                            }}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <div
                            key={entry.id}
                            className="group flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-2xl hover:bg-white hover:shadow-sm transition-all gap-2"
                        >
                            <div className="flex items-center gap-3 md:gap-8 flex-1 min-w-0 overflow-hidden">
                                <div className="flex flex-col flex-shrink-0 min-w-[50px]">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">
                                        {format(parseISO(entry.date), 'yyyy')}
                                    </span>
                                    <span className="text-xs font-black text-slate-700 whitespace-nowrap">
                                        {format(parseISO(entry.date), 'MMM d, HH:mm')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="flex items-baseline gap-0.5 overflow-hidden">
                                        <span className="text-sm font-black text-slate-700 tabular-nums">
                                            {entry.amount}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold lowercase shrink-0">ml</span>
                                    </div>
                                </div>

                                {entry.note && (
                                    <div className="hidden md:flex items-center gap-1.5 text-slate-500 bg-slate-50/50 px-2 py-1 rounded-lg border border-slate-100 max-w-[150px] shrink-0 overflow-hidden">
                                        <Info className="h-3 w-3 shrink-0" />
                                        <span className="text-[10px] font-medium truncate italic">{entry.note}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingId(entry.id)}
                                    className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-primary transition-all"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-destructive transition-all">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-[2rem] p-6 border-none shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-lg font-black">{t('deleteEntry')}</AlertDialogTitle>
                                            <AlertDialogDescription className="text-sm font-medium text-slate-500">
                                                {t('deleteMilkEntryDesc')} {format(parseISO(entry.date), 'MMM d, HH:mm')}.
                                                <br />{t('cannotUndo')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-4 gap-2">
                                            <AlertDialogCancel className="rounded-xl font-bold h-10 px-4 text-sm">{t('cancel')}</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(entry.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold h-10 px-4 text-sm"
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
