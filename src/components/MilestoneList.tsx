import { useMemo } from 'react';
import {
    Trophy,
    Activity,
    Brain,
    Heart,
    MessageCircle,
    ChevronRight,
    Star
} from 'lucide-react';
import { Baby, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { calculateAgeInMonths, cn } from '@/lib/utils';
import milestonesData from '@/data/milestones.json';

interface MilestoneListProps {
    baby: Baby;
    settings: AppSettings;
}

export function MilestoneList({ baby, settings }: MilestoneListProps) {
    const { t } = useTranslation(settings.language);
    const ageInMonths = useMemo(() => calculateAgeInMonths(baby.birthDate), [baby.birthDate]);
    const isBoy = baby.gender === 'male';

    const currentMilestones = useMemo(() => {
        // Find the closest month that is <= baby's age
        const monthlyData = [...milestonesData.monthly_development].sort((a, b) => b.month - a.month);
        return monthlyData.find(m => m.month <= ageInMonths) || monthlyData[monthlyData.length - 1];
    }, [ageInMonths]);

    if (!currentMilestones) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Age Header */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border",
                    isBoy ? "bg-blue-50/50 text-baby-boy border-blue-100" : "bg-pink-50/50 text-baby-girl border-pink-100"
                )}>
                    {t('expectedAt')} {currentMilestones.month} {t('monthsOld')}
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {currentMilestones.title}
                </h2>
            </div>

            {/* Hero Milestones */}
            <div className="grid grid-cols-1 gap-4">
                {currentMilestones.milestones.map((milestone, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden"
                    >
                        <div className={cn(
                            "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500",
                            isBoy ? "bg-baby-boy" : "bg-baby-girl"
                        )} />
                        <div className="relative p-6 kawaii-card bg-white/80 backdrop-blur-sm border-none shadow-sm flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                                isBoy ? "bg-blue-50 text-baby-boy" : "bg-pink-50 text-baby-girl"
                            )}>
                                <Trophy className="w-7 h-7" />
                            </div>
                            <p className="font-bold text-slate-700 text-lg leading-tight">
                                {milestone}
                            </p>
                            <Star className={cn(
                                "w-5 h-5 ml-auto opacity-20 group-hover:opacity-100 transition-opacity",
                                isBoy ? "text-baby-boy fill-baby-boy" : "text-baby-girl fill-baby-girl"
                            )} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Physical */}
                <CategoryCard
                    title={t('physical')}
                    items={currentMilestones.physical}
                    icon={<Activity className="w-5 h-5" />}
                    color={isBoy ? "baby-boy" : "baby-girl"}
                />

                {/* Cognitive */}
                <CategoryCard
                    title={t('cognitive')}
                    items={currentMilestones.cognitive}
                    icon={<Brain className="w-5 h-5" />}
                    color={isBoy ? "baby-boy" : "baby-girl"}
                />

                {/* Social & Emotional */}
                <CategoryCard
                    title={t('socialEmotional')}
                    items={currentMilestones.social_emotional}
                    icon={<Heart className="w-5 h-5" />}
                    color={isBoy ? "baby-boy" : "baby-girl"}
                />

                {/* Language */}
                <CategoryCard
                    title={t('milestoneLanguage')}
                    items={currentMilestones.language}
                    icon={<MessageCircle className="w-5 h-5" />}
                    color={isBoy ? "baby-boy" : "baby-girl"}
                />
            </div>

            <div className="pt-8 flex justify-center">
                <div className="text-center max-w-xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        Note: Every baby develops at their own pace. These are general guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
}

interface CategoryCardProps {
    title: string;
    items: string[];
    icon: React.ReactNode;
    color: string;
}

function CategoryCard({ title, items, icon, color }: CategoryCardProps) {
    return (
        <div className="kawaii-card p-6 space-y-4 bg-white/60 hover:bg-white/90 transition-colors duration-500 border-slate-100/50">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    color === "baby-boy" ? "bg-blue-50 text-baby-boy" : "bg-pink-50 text-baby-girl"
                )}>
                    {icon}
                </div>
                <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start group">
                        <div className={cn(
                            "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-150 transition-transform duration-300",
                            color === "baby-boy" ? "bg-baby-boy" : "bg-baby-girl"
                        )} />
                        <span className="text-sm font-medium text-slate-600 leading-snug">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
