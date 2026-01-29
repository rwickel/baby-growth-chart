import { useMemo } from 'react';
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

interface GrowthChartProps {
  entries: GrowthEntry[];
  gender: 'male' | 'female';
  birthDate?: string;
  settings: AppSettings;
}

type Metric = 'weight' | 'height';

export function GrowthChart({ entries, gender, birthDate, settings }: GrowthChartProps) {
  const { t } = useTranslation(settings.language);
  const references = growthReferences[gender];

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
        existingPoint.babyWeight = entry.weight;
        existingPoint.babyHeight = entry.height;
      } else {
        data.push({
          month,
          babyWeight: entry.weight,
          babyHeight: entry.height,
        });
      }
    });

    return data.sort((a, b) => (a.month || 0) - (b.month || 0));
  }, [entries, references, birthDate]);

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
                [`${metric}P3`]: '3rd percentile',
                [`${metric}P15`]: '15th percentile',
                [`${metric}P50`]: '50th percentile',
                [`${metric}P85`]: '85th percentile',
                [`${metric}P97`]: '97th percentile',
                [dataKey]: t('yourBaby'),
              };
              return [`${formatValue(value)} ${unit}`, labels[name] || name];
            }}
            labelFormatter={(value) => `${t('age')}: ${value} ${t('months')}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                [`${metric}P3`]: '3%',
                [`${metric}P15`]: '15%',
                [`${metric}P50`]: '50%',
                [`${metric}P85`]: '85%',
                [`${metric}P97`]: '97%',
                [dataKey]: `👶 ${t('yourBaby')}`,
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
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        📈 {t('growthCharts')}
      </h3>

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
  );
}
