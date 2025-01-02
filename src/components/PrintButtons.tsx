import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateMembersPDF, generateCollectorZip } from '@/utils/pdfGenerator';
import PDFGenerationProgress from "./PDFGenerationProgress";
import { Database } from '@/integrations/supabase/types';

type Member = Database['public']['Tables']['members']['Row'];

interface PrintButtonsProps {
  allMembers: Member[] | undefined;
  collectorName?: string;
  onGenerateStart?: () => void;
  onGenerateComplete?: () => void;
}

const PrintButtons = ({ 
  allMembers, 
  collectorName,
  onGenerateStart,
  onGenerateComplete 
}: PrintButtonsProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, collector: '' });

  const handlePrintAll = async () => {
    if (!allMembers) {
      toast({
        title: "Error",
        description: "No members data available to print",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      onGenerateStart?.();

      await generateCollectorZip(allMembers, (current, total, collector) => {
        setProgress({ current, total, collector });
      });

      toast({
        title: "Success",
        description: "ZIP file with all collector reports generated successfully",
      });
    } catch (error) {
      console.error('Error generating ZIP:', error);
      toast({
        title: "Error",
        description: "Failed to generate ZIP file",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      onGenerateComplete?.();
    }
  };

  const handlePrintCollector = async (name: string) => {
    try {
      const { data: collectorMembers, error } = await supabase
        .from('members')
        .select('*')
        .eq('collector', name)
        .order('member_number', { ascending: true });

      if (error) throw error;

      if (!collectorMembers?.length) {
        toast({
          title: "Error",
          description: "No members found for this collector",
          variant: "destructive",
        });
        return;
      }

      const doc = generateMembersPDF(collectorMembers, `Members List - Collector: ${name}`);
      doc.save();
      toast({
        title: "Success",
        description: "PDF report generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {isGenerating && (
        <PDFGenerationProgress 
          current={progress.current}
          total={progress.total}
          currentCollector={progress.collector}
        />
      )}
      
      {collectorName ? (
        <Button
          onClick={() => handlePrintCollector(collectorName)}
          className="flex items-center gap-2 bg-dashboard-accent2 hover:bg-dashboard-accent2/80"
          disabled={isGenerating}
        >
          <Printer className="w-4 h-4" />
          Print Members
        </Button>
      ) : (
        <Button 
          onClick={handlePrintAll}
          className="flex items-center gap-2 bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
          disabled={isGenerating}
        >
          <Printer className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Print All Members'}
        </Button>
      )}
    </div>
  );
};

export default PrintButtons;