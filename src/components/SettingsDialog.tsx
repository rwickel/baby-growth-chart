import { Settings, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppSettings, Language, WeightUnit, HeightUnit, Baby } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { languageNames } from '@/lib/translations';
import { exportToCSV, exportToPDF } from '@/lib/exportData';
import { toast } from 'sonner';

interface SettingsDialogProps {
  settings: AppSettings;
  activeBaby: Baby | null;
  onLanguageChange: (language: Language) => void;
  onWeightUnitChange: (unit: WeightUnit) => void;
  onHeightUnitChange: (unit: HeightUnit) => void;
}

export function SettingsDialog({
  settings,
  activeBaby,
  onLanguageChange,
  onWeightUnitChange,
  onHeightUnitChange,
}: SettingsDialogProps) {
  const { t } = useTranslation(settings.language);

  const handleExportCSV = () => {
    if (!activeBaby) return;
    exportToCSV(activeBaby, settings);
    toast.success('CSV exported!', {
      description: 'Your growth data has been downloaded.',
    });
  };

  const handleExportPDF = () => {
    if (!activeBaby) return;
    exportToPDF(activeBaby, settings);
    toast.success('PDF exported!', {
      description: 'Your growth report has been downloaded.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚙️ {t('settings')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lb">Pounds (lb)</SelectItem>
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
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeBaby && activeBaby.entries.length > 0 && (
            <div className="space-y-2">
              <Label>{t('export')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleExportCSV} className="w-full gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF} className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
