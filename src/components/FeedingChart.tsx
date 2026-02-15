import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { parseISO } from 'date-fns';
import { MilkEntry, AppSettings } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/lib/dateUtils';

interface FeedingChartProps {
    entries: MilkEntry[];
    settings: AppSettings;
    gender: 'male' | 'female';
}

export function FeedingChart({ entries, settings, gender }: FeedingChartProps) {
    const { t } = useTranslation(settings.language);
    const isBoy = gender === 'male';

    const chartData = useMemo(() => {
        if (entries.length === 0) return [];

        const dailyTotals = new Map<string, number>();

        // Group entries by day and sum amount
        entries.forEach((entry) => {
            const day = formatDate(parseISO(entry.date), 'yyyy-MM-dd', settings.language);
            dailyTotals.set(day, (dailyTotals.get(day) || 0) + entry.amount);
        });

        // Convert to Recharts format and sort by date
        return Array.from(dailyTotals.entries())
            .map(([date, amount]) => ({
                date,
                formattedDate: formatDate(parseISO(date), 'MMM dd', settings.language),
                amount,
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-7); // Show last 7 days
    }, [entries]);

    if (chartData.length === 0) {
        return (
            <div className="kawaii-card p-12 text-center space-y-4 bg-white/40">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-2 opacity-50">
                    <BarChart className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">{t('noEntries')}</p>
            </div>
        );
    }

    const barColor = isBoy ? '#A7D8F0' : '#F9C5D5'; // Using soft hex colors for the theme

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={isBoy ? "w-1.5 h-6 rounded-full bg-baby-boy shadow-[0_0_10px_rgba(var(--baby-boy)/0.3)]" : "w-1.5 h-6 rounded-full bg-baby-girl shadow-[0_0_10px_rgba(var(--baby-girl)/0.3)]"} />
                    <h3 className="font-black text-xl text-slate-800 tracking-tight">
                        {t('dailyVolume')}
                    </h3>
                </div>
                <div className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t('last7Days')}
                    </span>
                </div>
            </div>

            <div className="kawaii-card p-6 overflow-hidden bg-white/80">
                <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="hsl(var(--slate-100))" />
                            <XAxis
                                dataKey="formattedDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--slate-400))' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--slate-400))' }}
                                tickFormatter={(val) => `${val}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 12 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                    padding: '16px',
                                }}
                                itemStyle={{ color: 'hsl(var(--slate-800))', fontWeight: 900, fontSize: '14px' }}
                                labelStyle={{ color: 'hsl(var(--slate-400))', fontWeight: 800, marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                formatter={(val: number) => [val, t('amount')]}
                                labelFormatter={(label) => label}
                            />
                            <Bar
                                dataKey="amount"
                                radius={[12, 12, 12, 12]}
                                barSize={32}
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={barColor}
                                        className="transition-all duration-500 hover:opacity-80"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
