import { useMemo, useState, useEffect } from 'react';
import {
    Trophy,
    Activity,
    Brain,
    Heart,
    MessageCircle,
    ChevronLeft,
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
    const babyAgeInMonths = useMemo(() => calculateAgeInMonths(baby.birthDate), [baby.birthDate]);
    const [selectedMonth, setSelectedMonth] = useState(babyAgeInMonths);
    const isBoy = baby.gender === 'male';

    // Update selected month when baby changes or ages, but only if it matches current age
    useEffect(() => {
        setSelectedMonth(babyAgeInMonths);
    }, [babyAgeInMonths, baby.id]);

    const monthlyData = useMemo(() => {
        const lang = settings.language as keyof typeof milestonesData;
        const data = milestonesData[lang] || milestonesData.en;
        return [...data.monthly_development].sort((a, b) => a.month - b.month);
    }, [settings.language]);

    const currentMilestones = useMemo(() => {
        // Find the closest month that is <= selectedMonth
        const data = [...monthlyData].reverse();
        return data.find(m => m.month <= selectedMonth) || monthlyData[0];
    }, [selectedMonth, monthlyData]);

    const currentIndex = monthlyData.findIndex(m => m.month === currentMilestones.month);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setSelectedMonth(monthlyData[currentIndex - 1].month);
        }
    };

    const handleNext = () => {
        if (currentIndex < monthlyData.length - 1) {
            setSelectedMonth(monthlyData[currentIndex + 1].month);
        }
    };

    if (!currentMilestones) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation Header */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={cn(
                            "w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all bg-white/60 backdrop-blur-sm shadow-sm border border-white/40 active:scale-95",
                            currentIndex === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white hover:shadow-md hover:border-slate-200"
                        )}
                    >
                        <ChevronLeft className={cn("w-7 h-7", isBoy ? "text-baby-boy" : "text-baby-girl")} />
                    </button>

                    <div className="flex flex-col items-center min-w-[160px]">
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border -mb-3 z-10 bg-white",
                            isBoy ? "text-baby-boy border-blue-100" : "text-baby-girl border-pink-100"
                        )}>
                            {t('expectedAt')}
                        </div>
                        <div className={cn(
                            "flex flex-col items-center px-10 py-5 rounded-[2.5rem] border-2 transition-all duration-500 bg-white/40 backdrop-blur-sm",
                            isBoy
                                ? "border-blue-50 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.08)]"
                                : "border-pink-50 shadow-[0_10px_25px_-5px_rgba(236,72,153,0.08)]"
                        )}>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <h2 className={cn(
                                    "text-sm font-black tracking-tighter tabular-nums uppercase",
                                    isBoy ? "text-baby-boy" : "text-baby-girl"
                                )}>
                                    {currentMilestones.month} {t('monthsOld')}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === monthlyData.length - 1}
                        className={cn(
                            "w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all bg-white/60 backdrop-blur-sm shadow-sm border border-white/40 active:scale-95",
                            currentIndex === monthlyData.length - 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-white hover:shadow-md hover:border-slate-200"
                        )}
                    >
                        <ChevronRight className={cn("w-7 h-7", isBoy ? "text-baby-boy" : "text-baby-girl")} />
                    </button>
                </div>

                {selectedMonth !== babyAgeInMonths && (
                    <button
                        onClick={() => setSelectedMonth(babyAgeInMonths)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {t('backToAge')} {baby.name}
                        <div className="w-1 h-1 rounded-full bg-current" />
                    </button>
                )}
            </div>

            {/* Top Achievements / Highlights */}
            <CategoryCard
                title={t('milestones')}
                items={currentMilestones.milestones}
                icon={<Trophy className="w-5 h-5" />}
                color={isBoy ? "baby-boy" : "baby-girl"}
            />

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
                        {t('milestoneNote')}
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
