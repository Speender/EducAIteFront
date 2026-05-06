import { useEffect, useRef, useState, memo } from "react";
import { useStudentCertifications, useReplaceCertificates } from "../api/hooks";
import { useResumeStore } from "../hooks/useResumeStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Loader2, Sparkles } from "lucide-react";
import { CertificateSuggestionsSheet } from "@/features/certificates/components/CertificateSuggestionsSheet";
import { useDebounce } from "@/hooks/use-debounce";

interface CertificatesFormProps {
  resumeSqid: string;
}

const CertificatesForm = ({ resumeSqid }: CertificatesFormProps) => {
  const { data: allCerts, isLoading } = useStudentCertifications();
  const selectedCerts = useResumeStore((state) => state.data.certificates) || [];
  const updateStore = useResumeStore((state) => state.updateCertificates);
  const { mutateAsync: replaceCerts } = useReplaceCertificates(resumeSqid);

  const [localSelection, setLocalSelection] = useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const lastAutoSavedSelectionRef = useRef<string | null>(null);
  const lastPushedToStoreRef = useRef<string | null>(null);
  const skipNextAutoSaveRef = useRef(false);
  
  const debouncedSelection = useDebounce(localSelection, 700);

  // Initialize local selection from store once when data is available
  useEffect(() => {
    if (!hasInitialized && selectedCerts.length > 0) {
      const initialSelection = selectedCerts.map(c => c.certificationSqid);
      setLocalSelection(initialSelection);
      const signature = [...initialSelection].sort().join("|");
      lastAutoSavedSelectionRef.current = signature;
      lastPushedToStoreRef.current = signature;
      setHasInitialized(true);
    }
  }, [selectedCerts, hasInitialized]);

  // Handle resume switching
  useEffect(() => {
    setHasInitialized(false);
    lastAutoSavedSelectionRef.current = null;
    lastPushedToStoreRef.current = null;
  }, [resumeSqid]);

  // Update store when local selection changes
  useEffect(() => {
    if (!allCerts || !hasInitialized) return;
    
    const signature = [...localSelection].sort().join("|");
    if (signature !== lastPushedToStoreRef.current) {
      const selectedObjects = allCerts.filter((cert) => 
        localSelection.includes(cert.certificationSqid)
      );
      lastPushedToStoreRef.current = signature;
      updateStore(selectedObjects);
    }
  }, [localSelection, allCerts, updateStore, hasInitialized]);

  useEffect(() => {
    if (!hasInitialized) return;

    const signature = [...debouncedSelection].sort().join("|");
    if (signature === lastAutoSavedSelectionRef.current) return;
    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false;
      lastAutoSavedSelectionRef.current = signature;
      return;
    }

    void replaceCerts({ certificationSqids: debouncedSelection })
      .then(() => { lastAutoSavedSelectionRef.current = signature; })
      .catch(console.error);
  }, [debouncedSelection, hasInitialized, replaceCerts]);

  const handleToggle = (sqid: string) => {
    setLocalSelection(prev => 
      prev.includes(sqid) ? prev.filter(id => id !== sqid) : [...prev, sqid]
    );
  };

  const handleSuggestionsSave = (sqids: string[]) => {
    skipNextAutoSaveRef.current = true;
    setLocalSelection(sqids);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs text-white/50 italic">Select certificates to showcase on this resume</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[#FFB800] hover:text-[#FFB800] hover:bg-[#FFB800]/10 font-bold p-0"
            onClick={() => setIsSuggestionsOpen(true)}
          >
            <Sparkles className="w-3 h-3 mr-2 fill-[#FFB800]" />
            AI Suggestions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {allCerts?.map((cert) => (
          <Card 
            key={cert.certificationSqid}
            className={`bg-[#111] border-white/5 cursor-pointer transition-all hover:border-[#00CEC8]/30 ${
                localSelection.includes(cert.certificationSqid) ? 'border-[#00CEC8]/50 bg-[#00CEC8]/5' : ''
            }`}
            onClick={() => handleToggle(cert.certificationSqid)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Checkbox 
                checked={localSelection.includes(cert.certificationSqid)}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={() => handleToggle(cert.certificationSqid)}
                className="border-white/20 data-[state=checked]:bg-[#00CEC8] data-[state=checked]:border-[#00CEC8]"
              />
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#00CEC8]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{cert.achievementName}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-tighter">{cert.institution}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {allCerts?.length === 0 && (
          <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Award className="w-10 h-10 text-white/5 mb-4" />
            <p className="text-sm text-white/20">You haven't earned any certificates yet.</p>
          </div>
        )}
      </div>

      <CertificateSuggestionsSheet
        resumeSqid={resumeSqid}
        open={isSuggestionsOpen}
        onOpenChange={setIsSuggestionsOpen}
        currentCertificateSqids={localSelection}
        onSelectionChange={handleSuggestionsSave}
      />
    </div>
  );
};

export default memo(CertificatesForm);
