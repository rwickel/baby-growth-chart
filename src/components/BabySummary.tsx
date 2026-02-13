import { Baby, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { displayWeight, displayHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BabySummaryProps {
    baby: Baby;
    settings: AppSettings;
}

export function BabySummary({ baby, settings }: BabySummaryProps) {
    const { t } = useTranslation(settings.language);
    const latestEntry = baby.entries.length > 0 ? baby.entries[baby.entries.length - 1] : null;
    const previousEntry = baby.entries.length > 1 ? baby.entries[baby.entries.length - 2] : null;

    if (!latestEntry) return null;

    const isBoy = baby.gender === 'male';
    const accentColor = isBoy ? 'text-baby-boy' : 'text-baby-girl';
    const bgColor = isBoy ? 'bg-baby-boy-soft' : 'bg-baby-girl-soft';

    return (
        <div className="kawaii-card p-6 md:p-8 relative group overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className={cn("w-1.5 h-8 rounded-full", isBoy ? "bg-baby-boy" : "bg-baby-girl")} />
                    <h3 className="font-black text-2xl text-slate-800 tracking-tight">
                        {baby.name}'s {t('growth')}
                    </h3>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-4 py-2 rounded-2xl hover:bg-slate-50 transition-all">
                    {t('viewDetails')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Weight Card Segment */}
                <div className="flex items-center gap-6 p-4 rounded-[2rem] bg-slate-50/50 border border-white">
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm shrink-0", bgColor)}>
                        <TrendingUp className={cn("w-8 h-8", accentColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            {t('weight')}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-800 tabular-nums">
                                {displayWeight(latestEntry.weight, settings.weightUnit)}
                            </span>
                            <span className="text-sm font-bold text-slate-400 lowercase">
                                {getWeightLabel(settings.weightUnit)}
                            </span>
                        </div>
                    </div>
                    {/* Visual trend hint sparkle or similar from draft */}
                    <div className="hidden sm:block w-12 h-6 rounded-full bg-white shadow-inner flex items-center justify-center">
                        <div className={cn("w-1.5 h-1.5 rounded-full", isBoy ? "bg-baby-boy" : "bg-baby-girl")} />
                    </div>
                </div>

                {/* Height Card Segment */}
                <div className="flex items-center gap-6 p-4 rounded-[2rem] bg-slate-50/50 border border-white">
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm shrink-0", bgColor)}>
                        <TrendingUp className={cn("w-8 h-8", accentColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            {t('height')}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-800 tabular-nums">
                                {displayHeight(latestEntry.height, settings.heightUnit)}
                            </span>
                            <span className="text-sm font-bold text-slate-400 lowercase">
                                {getHeightLabel(settings.heightUnit)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className={cn(
                "absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-5 blur-3xl -z-10",
                isBoy ? "bg-baby-boy" : "bg-baby-girl"
            )} />
        </div>
    );
}
