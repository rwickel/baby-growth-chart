import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppSettings, Language, WeightUnit, HeightUnit } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { languageNames } from '@/lib/translations';
import { Languages, Scale, Ruler } from 'lucide-react';

interface SettingsControlsProps {
  settings: AppSettings;
  onLanguageChange: (language: Language) => void;
  onWeightUnitChange: (unit: WeightUnit) => void;
  onHeightUnitChange: (unit: HeightUnit) => void;
}

export function SettingsControls({
  settings,
  onLanguageChange,
  onWeightUnitChange,
  onHeightUnitChange,
}: SettingsControlsProps) {
  const { t } = useTranslation(settings.language);

  const ControlGroup = ({
    label,
    icon: Icon,
    children
  }: {
    label: string,
    icon: any,
    children: React.ReactNode
  }) => (
    <div className="space-y-3 glass-card p-4 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-slate-600">
        <Icon className="h-4 w-4 text-primary" />
        <Label className="text-xs font-bold uppercase tracking-wider">{label}</Label>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 text-left">
      <ControlGroup label={t('language')} icon={Languages}>
        <Select value={settings.language} onValueChange={(v) => onLanguageChange(v as Language)}>
          <SelectTrigger className="bg-white/50 border-white/60 hover:bg-white/80 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {languageNames[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ControlGroup>

      <ControlGroup label={t('weightUnit')} icon={Scale}>
        <Select value={settings.weightUnit} onValueChange={(v) => onWeightUnitChange(v as WeightUnit)}>
          <SelectTrigger className="bg-white/50 border-white/60 hover:bg-white/80 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="kg">{t('kilograms')} (kg)</SelectItem>
            <SelectItem value="lb">{t('pounds')} (lb)</SelectItem>
          </SelectContent>
        </Select>
      </ControlGroup>

      <ControlGroup label={t('heightUnit')} icon={Ruler}>
        <Select value={settings.heightUnit} onValueChange={(v) => onHeightUnitChange(v as HeightUnit)}>
          <SelectTrigger className="bg-white/50 border-white/60 hover:bg-white/80 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="cm">{t('centimeters')} (cm)</SelectItem>
            <SelectItem value="in">{t('inches')} (in)</SelectItem>
          </SelectContent>
        </Select>
      </ControlGroup>
    </div>
  );
}
