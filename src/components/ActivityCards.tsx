import { Baby, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Droplets, Moon, Footprints, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ActivityCardProps {
    baby: Baby;
    settings: AppSettings;
    onAdd?: () => void;
}

export function FeedingActivityCard({ baby, settings, onAdd }: ActivityCardProps) {
    const { t } = useTranslation(settings.language);
    const latestFeeding = baby.milkEntries.length > 0 ? baby.milkEntries[baby.milkEntries.length - 1] : null;

    return (
        <div className="kawaii-card p-6 flex flex-col items-center gap-4 text-center group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Droplets className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-1">
                <h4 className="font-black text-slate-800">{t('feeding')}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {latestFeeding ? `${latestFeeding.amount}ml at ${format(new Date(latestFeeding.date), 'HH:mm')}` : 'No data'}
                </p>
            </div>
            <Button
                onClick={onAdd}
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-500 transition-all shadow-inner"
            >
                <Plus className="w-5 h-5" />
            </Button>
        </div>
    );
}

export function SleepActivityCard({ baby, settings }: ActivityCardProps) {
    const { t } = useTranslation(settings.language);

    return (
        <div className="kawaii-card p-6 flex flex-col items-center gap-4 text-center group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Moon className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-1">
                <h4 className="font-black text-slate-800">Sleep</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {baby.name}: 3h nap
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-500 transition-all shadow-inner"
            >
                <Plus className="w-5 h-5" />
            </Button>
        </div>
    );
}

export function MilestoneActivityCard({ baby, settings }: ActivityCardProps) {
    const { t } = useTranslation(settings.language);

    return (
        <div className="kawaii-card p-6 flex flex-col items-center gap-4 text-center group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Footprints className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-1">
                <h4 className="font-black text-slate-800">Milestone</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Rolled over!
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-500 transition-all shadow-inner"
            >
                <Plus className="w-5 h-5" />
            </Button>
        </div>
    );
}
