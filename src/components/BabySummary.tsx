import { Baby, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { displayWeight, displayHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
    const weightTrend = previousEntry ? (latestEntry.weight > previousEntry.weight ? 'up' : latestEntry.weight < previousEntry.weight ? 'down' : 'stable') : 'none';

    return (
        <Card className="glass-card p-6 rounded-[2rem] border-none overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${isBoy ? 'bg-baby-boy' : 'bg-baby-girl'}`} />

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-xl text-slate-800">{baby.name}'s {t('growth')}</h3>
                <button className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-full hover:bg-primary/10 transition-colors">
                    {t('viewDetails')}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isBoy ? 'bg-soft-blue' : 'bg-soft-pink'}`}>
                        <div
                            className="w-10 h-10"
                            style={{
                                backgroundImage: 'url("/assets/weight_icon.png")',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{t('weight')}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-black text-slate-800">
                                {displayWeight(latestEntry.weight, settings.weightUnit)} {getWeightLabel(settings.weightUnit)}
                            </span>
                            {weightTrend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                            {weightTrend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                            {weightTrend === 'stable' && <Minus className="w-4 h-4 text-slate-400" />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isBoy ? 'bg-soft-blue' : 'bg-soft-pink'} bg-opacity-50`}>
                        <TrendingUp className={`w-8 h-8 ${isBoy ? 'text-baby-boy' : 'text-baby-girl'}`} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{t('height')}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-black text-slate-800">
                                {displayHeight(latestEntry.height, settings.heightUnit)} {getHeightLabel(settings.heightUnit)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
