import { LineChart, Droplets, Trophy } from 'lucide-react';
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

    const tabs: { id: TabType; icon: any; label: string }[] = [
        { id: 'growth', icon: LineChart, label: t('growth') },
        { id: 'feeding', icon: Droplets, label: t('feeding') },
        { id: 'milestones', icon: Trophy, label: 'Milestones' },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md">
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
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                isActive ? "bg-white shadow-sm ring-1 ring-slate-900/5 rotate-0" : "rotate-0"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-slate-900" : "text-inherit"
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
