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
import { differenceInMonths, parseISO } from 'date-fns';
import { GrowthEntry, AppSettings } from '@/types/baby';
import growthReferences from '@/data/growthReferences.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { displayWeight, displayHeight, getWeightLabel, getHeightLabel } from '@/lib/unitConversions';
import { Button } from '@/components/ui/button';
import { Share2, Download, FileSpreadsheet } from 'lucide-react';
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
    };
  }, [babyName, gender, birthDate, entries]);

  const getAgeInMonths = (date: string): number => {
    if (birthDate) {
      return differenceInMonths(parseISO(date), parseISO(birthDate));
    }
    if (entries.length > 0) {
      const firstDate = parseISO(entries[0].date);
      return differenceInMonths(parseISO(date), firstDate);
    }
    return 0;
  };

  const chartData = useMemo(() => {
    const data: Record<string, number | undefined>[] = [];

    // Add reference data points (always in kg/cm)
    references.weight.months.forEach((month, index) => {
      data.push({
        month,
        weightP3: references.weight.p3[index],
        weightP15: references.weight.p15[index],
        weightP50: references.weight.p50[index],
        weightP85: references.weight.p85[index],
        weightP97: references.weight.p97[index],
        heightP3: references.height.p3[index],
        heightP15: references.height.p15[index],
        heightP50: references.height.p50[index],
        heightP85: references.height.p85[index],
        heightP97: references.height.p97[index],
      });
    });

    // Add baby's data points
    entries.forEach((entry) => {
      const month = getAgeInMonths(entry.date);
      const existingPoint = data.find((d) => d.month === month);
      if (existingPoint) {
        existingPoint.babyWeight = entry.weight > 0 ? entry.weight : undefined;
        existingPoint.babyHeight = entry.height > 0 ? entry.height : undefined;
      } else {
        data.push({
          month,
          babyWeight: entry.weight > 0 ? entry.weight : undefined,
          babyHeight: entry.height > 0 ? entry.height : undefined,
        });
      }
    });

    return data.sort((a, b) => (a.month || 0) - (b.month || 0));
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
        // For Android/iOS, the best way to share an image is to save it to a file first
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

      // Web fallback
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
        // Ultimate fallback: just download the image
        handleDownload();
      }
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to share chart');
      // If we failed after generating image, try to at least download it
      handleDownload();
    }
  };

  const renderChart = (metric: Metric) => {
    const dataKey = metric === 'weight' ? 'babyWeight' : 'babyHeight';
    const unit = metric === 'weight' ? getWeightLabel(settings.weightUnit) : getHeightLabel(settings.heightUnit);
    const color = gender === 'male' ? 'hsl(200, 80%, 65%)' : 'hsl(340, 70%, 70%)';

    const formatValue = (value: number) => {
      if (metric === 'weight') {
        return displayWeight(value, settings.weightUnit);
      }
      return displayHeight(value, settings.heightUnit);
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="month"
            label={{ value: t('ageMonths'), position: 'bottom', offset: -5 }}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            label={{ value: `${t(metric)} (${unit})`, angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(value) => formatValue(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '12px',
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
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                [`${metric}P3`]: 'P3',
                [`${metric}P15`]: 'P15',
                [`${metric}P50`]: 'P50',
                [`${metric}P85`]: 'P85',
                [`${metric}P97`]: 'P97',
                [dataKey]: `👶 ${babyName || t('yourBaby')}`,
              };
              return labels[value] || value;
            }}
          />

          {/* Reference lines */}
          <Line type="monotone" dataKey={`${metric}P3`} stroke="hsl(var(--chart-p3))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P3`} />
          <Line type="monotone" dataKey={`${metric}P15`} stroke="hsl(var(--chart-p15))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P15`} />
          <Line type="monotone" dataKey={`${metric}P50`} stroke="hsl(var(--chart-p50))" strokeWidth={2} dot={false} name={`${metric}P50`} />
          <Line type="monotone" dataKey={`${metric}P85`} stroke="hsl(var(--chart-p85))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P85`} />
          <Line type="monotone" dataKey={`${metric}P97`} stroke="hsl(var(--chart-p97))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={`${metric}P97`} />

          {/* Baby's data */}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
            name={dataKey}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="font-bold text-lg mb-2">{t('noChartData')}</h3>
        <p className="text-muted-foreground">{t('noChartDataDesc')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* <h3 className="font-bold text-lg flex items-center gap-2">
           📈 {t('growthCharts')}
        </h3> */}
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
            {renderChart('weight')}
          </TabsContent>
          <TabsContent value="height" className="mt-6">
            {renderChart('height')}
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground text-center pt-4">
          {t('whoStandards')}
        </div>
      </div>
    </div >
  );
}
