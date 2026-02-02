import { Settings, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AppSettings, Language, WeightUnit, HeightUnit, Baby } from '@/types/baby';
import { useTranslation } from '@/hooks/useTranslation';
import { exportToCSV, exportToPDF } from '@/lib/exportData';
import { toast } from 'sonner';
import { SettingsControls } from './SettingsControls';

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
          <DialogDescription>
            {t('appSubtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <SettingsControls
            settings={settings}
            onLanguageChange={onLanguageChange}
            onWeightUnitChange={onWeightUnitChange}
            onHeightUnitChange={onHeightUnitChange}
          />

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
