import { Settings, FileText, FileSpreadsheet, Download } from 'lucide-react';
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
    toast.success(t('csvExported'), {
      description: t('csvExportDesc'),
    });
  };

  const handleExportPDF = () => {
    if (!activeBaby) return;
    exportToPDF(activeBaby, settings);
    toast.success(t('pdfExported'), {
      description: t('pdfExportDesc'),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-white/50 transition-colors">
          <Settings className="h-5 w-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px] bg-gradient-soft border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-baby-boy to-baby-girl opacity-50" />

        <DialogHeader className="pt-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-nunito font-black text-slate-700">
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
              <Settings className="h-5 w-5 text-primary animate-spin-slow" />
            </div>
            {t('settings')}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium px-1">
            {t('customizeAppExperience')}
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
            <div className="space-y-3 glass-card p-4 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Download className="h-4 w-4 text-primary" />
                <Label className="text-xs font-bold uppercase tracking-wider">{t('export')}</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="w-full gap-2 rounded-xl bg-white/50 border-white/60 hover:bg-white hover:border-primary/30 transition-all font-bold text-xs"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-green-500" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  className="w-full gap-2 rounded-xl bg-white/50 border-white/60 hover:bg-white hover:border-primary/30 transition-all font-bold text-xs"
                >
                  <FileText className="h-3.5 w-3.5 text-red-400" />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 pt-4 border-t border-slate-200/30 flex flex-col items-center gap-2 bg-white/20 -mx-6 px-6 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {t('appTitle')}
          </p>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-slate-200" />
            <p className="text-[9px] font-bold text-primary/60 bg-white/80 px-3 py-1 rounded-full border border-white/60 shadow-sm">
              v{__APP_VERSION__}
            </p>
            <span className="h-px w-8 bg-slate-200" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
