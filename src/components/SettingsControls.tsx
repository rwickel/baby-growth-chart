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

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-2">
        <Label>{t('language')}</Label>
        <Select value={settings.language} onValueChange={(v) => onLanguageChange(v as Language)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {languageNames[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('weightUnit')}</Label>
        <Select value={settings.weightUnit} onValueChange={(v) => onWeightUnitChange(v as WeightUnit)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">{t('kilograms')} (kg)</SelectItem>
            <SelectItem value="lb">{t('pounds')} (lb)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('heightUnit')}</Label>
        <Select value={settings.heightUnit} onValueChange={(v) => onHeightUnitChange(v as HeightUnit)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">{t('centimeters')} (cm)</SelectItem>
            <SelectItem value="in">{t('inches')} (in)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
