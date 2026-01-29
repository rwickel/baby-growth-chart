import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GrowthEntry, Gender } from '@/types/baby';
import { exportToCSV, exportToPDF } from '@/lib/exportData';
import { toast } from 'sonner';

interface ExportButtonsProps {
  entries: GrowthEntry[];
  gender: Gender;
}

export function ExportButtons({ entries, gender }: ExportButtonsProps) {
  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.error('No data to export', {
        description: 'Add some entries first before exporting.',
      });
      return;
    }
    exportToCSV(entries, gender);
    toast.success('CSV exported!', {
      description: 'Your growth data has been downloaded.',
    });
  };

  const handleExportPDF = () => {
    if (entries.length === 0) {
      toast.error('No data to export', {
        description: 'Add some entries first before exporting.',
      });
      return;
    }
    exportToPDF(entries, gender);
    toast.success('PDF exported!', {
      description: 'Your growth report has been downloaded.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
