import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Baby, AppSettings } from '@/types/baby';
import { exportToCSV, exportToPDF } from '@/lib/exportData';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface ExportButtonsProps {
  baby: Baby | null;
  settings: AppSettings;
}

export function ExportButtons({ baby, settings }: ExportButtonsProps) {
  const { t } = useTranslation(settings.language);

  if (!baby || baby.entries.length === 0) {
    return null;
  }

  const handleExportCSV = () => {
    exportToCSV(baby, settings);
    toast.success('CSV exported!', {
      description: 'Your growth data has been downloaded.',
    });
  };

  const handleExportPDF = () => {
    exportToPDF(baby, settings);
    toast.success('PDF exported!', {
      description: 'Your growth report has been downloaded.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          {t('export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          {t('exportCSV')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          {t('exportPDF')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
