import { Scale, Droplets, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/types/baby';

export type TabType = 'growth' | 'feeding' | 'milestones';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    language: Language;
}

export function BottomNav({ activeTab, onTabChange, language }: BottomNavProps) {
    const { t } = useTranslation(language);

    const tabs: { id: TabType; icon: any; label: string; color: string }[] = [
        { id: 'growth', icon: Scale, label: t('growth'), color: 'text-indigo-400' },
        { id: 'feeding', icon: Droplets, label: t('feeding'), color: 'text-blue-400' },
        { id: 'milestones', icon: Footprints, label: t('milestones'), color: 'text-rose-400' },
    ];

    return (
        <nav className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] p-2 flex items-center justify-around shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 min-w-[4rem] py-2 px-3 rounded-2xl transition-all duration-500",
                                isActive
                                    ? "bg-slate-900/5 scale-105"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-900/0"
                            )}
                        >
                            <div className={cn(
                                "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500",
                                isActive ? "bg-white shadow-md ring-1 ring-slate-900/5 -translate-y-1" : "bg-transparent"
                            )}>
                                <tab.icon className={cn(
                                    "w-6 h-6 transition-all duration-500 stroke-[2.5px]",
                                    isActive ? tab.color : "text-slate-300"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-all",
                                isActive ? "text-slate-900" : "text-inherit"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
