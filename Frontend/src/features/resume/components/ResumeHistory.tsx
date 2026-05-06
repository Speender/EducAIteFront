import { useResumeHistory } from "../api/hooks";
import { Button } from "@/components/ui/button";
import { History, Calendar, Download, Eye, Hash, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ResumeHistoryProps {
  resumeSqid: string;
  onBack: () => void;
}

const ResumeHistory = ({ resumeSqid, onBack }: ResumeHistoryProps) => {
  const { data, isLoading } = useResumeHistory(resumeSqid);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-8 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 text-[#00CEC8] hover:text-[#00CEC8] hover:bg-[#00CEC8]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Editor
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Version History</h1>
          <p className="text-white/40">View and retrieve past snapshots of this resume.</p>
        </div>

        <div className="space-y-4">
          {data?.items.map((version: any) => (
            <div 
              key={version.resumeVersionSqid}
              className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-[#00CEC8]/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-[#00CEC8]/20 transition-all">
                  <span className="text-[10px] font-mono text-white/40 uppercase leading-none">Ver</span>
                  <span className="text-lg font-bold text-white leading-none">{version.versionNumber}</span>
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {version.saveNote || `Snapshot Version ${version.versionNumber}`}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(version.savedAt), "MMM dd, yyyy • HH:mm")}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Hash className="w-3 h-3" />
                      {version.snapshotHash.substring(0, 8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Restore
                </Button>
              </div>
            </div>
          ))}

          {data?.items.length === 0 && (
            <div className="py-24 border border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
              <History className="w-12 h-12 text-white/5 mb-4" />
              <p className="text-lg font-medium text-white/20">No saved versions yet.</p>
              <p className="text-sm text-white/10 max-w-xs mt-2">
                Click "Save Version" in the editor to create an immutable snapshot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
