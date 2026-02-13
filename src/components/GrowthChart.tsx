import { useMemo, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { differenceInDays, parseISO } from 'date-fns';
import { GrowthEntry, AppSettings } from '@/types/baby';
import growthReferences from '@/data/growthReferences.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { displayWeight, displayHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';
import { Button } from '@/components/ui/button';
import { Share2, Download, FileSpreadsheet, LineChart as LineChartIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/exportData';
import { Baby } from '@/types/baby';

interface GrowthChartProps {
  entries: GrowthEntry[];
  gender: 'male' | 'female';
  birthDate?: string;
  settings: AppSettings;
  babyName?: string;
}

type Metric = 'weight' | 'height';

interface MetricChartProps {
  metric: Metric;
  entries: GrowthEntry[];
  gender: 'male' | 'female';
  settings: AppSettings;
  babyName?: string;
  chartData: any[];
  birthDate?: string;
}

function MetricChart({ metric, entries, gender, settings, babyName, chartData, birthDate }: MetricChartProps) {
  const { t } = useTranslation(settings.language);

  const dataKey = metric === 'weight' ? 'babyWeight' : 'babyHeight';
  const unit = metric === 'weight' ? getWeightLabel(settings.weightUnit) : getHeightLabel(settings.heightUnit);
  const color = gender === 'male' ? 'hsl(200, 80%, 65%)' : 'hsl(340, 70%, 70%)';

  const formatValue = (value: number) => {
    if (metric === 'weight') {
      return displayWeight(value, settings.weightUnit);
    }
    return displayHeight(value, settings.heightUnit);
  };

  const getAgeInMonths = (date: string): number => {
    const d1 = parseISO(date);
    const d2 = birthDate ? parseISO(birthDate) : (entries.length > 0 ? parseISO(entries[0].date) : d1);
    const days = differenceInDays(d1, d2);
    return Number((days / 30.4375).toFixed(2));
  };

  const maxAge = useMemo(() => {
    if (entries.length === 0) return 60;
    const latestEntryAge = getAgeInMonths(entries[entries.length - 1].date);
    if (latestEntryAge <= 6) return 6;
    if (latestEntryAge <= 12) return 12;
    if (latestEntryAge <= 24) return 24;
    if (latestEntryAge <= 36) return 36;
    if (latestEntryAge <= 48) return 48;
    return 60;
  }, [entries]);

  const xAxisTicks = useMemo(() => {
    if (maxAge <= 6) return [0, 1, 2, 3, 4, 5, 6];
    if (maxAge <= 12) return [0, 2, 4, 6, 8, 10, 12];
    if (maxAge <= 24) return [0, 4, 8, 12, 16, 20, 24];
    return [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60];
  }, [maxAge]);

  const filteredData = useMemo(() => {
    return chartData.filter(d => (d.month || 0) <= maxAge);
  }, [chartData, maxAge]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={filteredData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis
          dataKey="month"
          type="number"
          domain={[0, maxAge]}
          ticks={xAxisTicks}
          label={{ value: t('ageMonths'), position: 'bottom', offset: -5, fontSize: 10 }}
          tick={{ fontSize: 10 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          domain={['auto', 'auto']}
          padding={{ top: 0, bottom: 0 }}
          label={{ value: `${t(metric)} (${unit})`, angle: -90, position: 'insideLeft', fontSize: 10 }}
          tick={{ fontSize: 10 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value) => formatValue(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            padding: '4px',
            fontSize: '10px',
          }}
          formatter={(value: number, name: string) => {
            const labels: Record<string, string> = {
              [`${metric}P3`]: 'P3',
              [`${metric}P15`]: 'P15',
              [`${metric}P50`]: 'P50',
              [`${metric}P85`]: 'P85',
              [`${metric}P97`]: 'P97',
              [dataKey]: babyName || t('yourBaby'),
            };
            return [`${formatValue(value)} ${unit}`, labels[name] || name];
          }}
          labelFormatter={(value) => `${t('age')}: ${value} ${t('months')}`}
        />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              [`${metric}P3`]: 'P3',
              [`${metric}P15`]: 'P15',
              [`${metric}P50`]: 'P50',
              [`${metric}P85`]: 'P85',
              [`${metric}P97`]: 'P97',
              [dataKey]: babyName || t('yourBaby'),
            };
            return labels[value] || value;
          }}
        />

        {/* Reference lines */}
        <Line type="monotone" dataKey={`${metric}P3`} stroke="hsl(var(--chart-p3))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P3`} connectNulls />
        <Line type="monotone" dataKey={`${metric}P15`} stroke="hsl(var(--chart-p15))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P15`} connectNulls />
        <Line type="monotone" dataKey={`${metric}P50`} stroke="hsl(var(--chart-p50))" strokeWidth={2} dot={false} name={`${metric}P50`} connectNulls />
        <Line type="monotone" dataKey={`${metric}P85`} stroke="hsl(var(--chart-p85))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P85`} connectNulls />
        <Line type="monotone" dataKey={`${metric}P97`} stroke="hsl(var(--chart-p97))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P97`} connectNulls />

        {/* Baby's data */}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 1, r: 6 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 1 }}
          name={dataKey}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function GrowthChart({ entries, gender, birthDate, settings, babyName }: GrowthChartProps) {
  const { t } = useTranslation(settings.language);
  const chartRef = useRef<HTMLDivElement>(null);
  const references = growthReferences[gender];

  // Create a local baby object for CSV export if needed
  const activeBabyObject: Baby | null = useMemo(() => {
    if (!babyName) return null;
    return {
      id: 'local',
      name: babyName,
      gender,
      birthDate: birthDate || '',
      entries,
      milkEntries: [],
    };
  }, [babyName, gender, birthDate, entries]);

  const chartData = useMemo(() => {
    const dataMap = new Map<number, Record<string, number | undefined>>();

    const getOrInit = (month: number) => {
      if (!dataMap.has(month)) {
        dataMap.set(month, { month });
      }
      return dataMap.get(month)!;
    };

    const getAgeInMonths = (date: string): number => {
      const d1 = parseISO(date);
      const d2 = birthDate ? parseISO(birthDate) : (entries.length > 0 ? parseISO(entries[0].date) : d1);
      const days = differenceInDays(d1, d2);
      return Number((days / 30.4375).toFixed(2));
    };

    // Add weight reference data
    references.weight.months.forEach((month, index) => {
      const point = getOrInit(month);
      point.weightP3 = references.weight.p3[index];
      point.weightP15 = references.weight.p15[index];
      point.weightP50 = references.weight.p50[index];
      point.weightP85 = references.weight.p85[index];
      point.weightP97 = references.weight.p97[index];
    });

    // Add height reference data
    references.height.months.forEach((month, index) => {
      const point = getOrInit(month);
      point.heightP3 = references.height.p3[index];
      point.heightP15 = references.height.p15[index];
      point.heightP50 = references.height.p50[index];
      point.heightP85 = references.height.p85[index];
      point.heightP97 = references.height.p97[index];
    });

    // Add baby's data points
    entries.forEach((entry) => {
      const month = getAgeInMonths(entry.date);
      const point = getOrInit(month);
      point.babyWeight = entry.weight > 0 ? entry.weight : undefined;
      point.babyHeight = entry.height > 0 ? entry.height : undefined;
    });

    return Array.from(dataMap.values()).sort((a, b) => (a.month || 0) - (b.month || 0));
  }, [entries, references, birthDate]);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: 'white' });
      const link = document.createElement('a');
      link.download = `growth-chart-${babyName || 'baby'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(t('chartDownloaded'), {
        description: t('downloadHint'),
      });
    } catch (err) {
      toast.error('Failed to download chart');
    }
  };

  const handleShare = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: 'white' });

      const { Capacitor } = await import("@capacitor/core");
      const isNative = Capacitor.isNativePlatform();

      if (isNative) {
        const { Filesystem, Directory } = await import("@capacitor/filesystem");
        const { Share } = await import("@capacitor/share");

        const fileName = `growth-chart-${babyName || 'baby'}-${Date.now()}.png`;
        const base64Data = dataUrl.split(',')[1];

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
        });

        await Share.share({
          title: `${babyName || t('yourBaby')} - ${t('growthCharts')}`,
          text: t('whoStandards'),
          files: [savedFile.uri],
          dialogTitle: t('share'),
        });
        toast.success(t('chartShared'));
        return;
      }

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `growth-chart-${babyName || 'baby'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${babyName || t('yourBaby')} - ${t('growthCharts')}`,
          text: t('whoStandards'),
        });
        toast.success(t('chartShared'));
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to share chart');
      handleDownload();
    }
  };

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 text-center flex flex-col items-center border-none shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <LineChartIcon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-extrabold text-2xl mb-3 text-slate-800">{t('noChartData')}</h3>
        <p className="text-slate-500 max-w-sm mx-auto">{t('noChartDataDesc')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-8 border-none shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare} title={t('share')}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload} title={t('download')}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => {
            if (activeBabyObject) {
              exportToCSV(activeBabyObject, settings);
              toast.success(t('dataExported'));
            }
          }} title={t('exportCSV')}>
            <FileSpreadsheet className="h-4 w-4" />
          </Button>
        </div>

      </div>

      <div ref={chartRef} className="bg-card rounded-xl p-2">
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full max-w-[300px] grid-cols-2">
            <TabsTrigger value="weight">{t('weight')}</TabsTrigger>
            <TabsTrigger value="height">{t('height')}</TabsTrigger>
          </TabsList>
          <TabsContent value="weight" className="mt-6">
            <MetricChart
              metric="weight"
              entries={entries}
              gender={gender}
              settings={settings}
              babyName={babyName}
              chartData={chartData}
              birthDate={birthDate}
            />
          </TabsContent>
          <TabsContent value="height" className="mt-6">
            <MetricChart
              metric="height"
              entries={entries}
              gender={gender}
              settings={settings}
              babyName={babyName}
              chartData={chartData}
              birthDate={birthDate}
            />
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground text-center pt-4">
          {t('whoStandards')}
        </div>
      </div>
    </div >
  );
}
