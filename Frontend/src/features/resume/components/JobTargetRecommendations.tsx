import { useState, useEffect } from "react";
import { Loader2, Target, Briefcase, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useJobTargetSuggestions,
  useUpdateTargetRole,
} from "../api/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ToastProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobTargetRecommendationsProps {
  resumeSqid: string;
  onComplete: () => void;
}

export default function JobTargetRecommendations({
  resumeSqid,
  onComplete,
}: JobTargetRecommendationsProps) {
  const suggestionsMutation = useJobTargetSuggestions(resumeSqid);
  const updateTargetRoleMutation = useUpdateTargetRole(resumeSqid);
  const { showSuccess } = useToast();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [hasRequested, setHasRequested] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState("");

  useEffect(() => {
    // Auto-fetch suggestions when component mounts. Backend falls back to saved resume context if fields are empty.
    if (!hasRequested && !suggestionsMutation.isPending) {
      setHasRequested(true);
      suggestionsMutation.mutate(
        {
          degreeProgram: null,
          yearLevel: null,
          subjects: [],
          certificates: [],
        },
        {
          onSuccess: (data) => {
            setSuggestions(data.suggestions || []);
          },
        }
      );
    }
  }, [hasRequested, suggestionsMutation]);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setCustomRole("");
  };

  const handleSaveTargetRole = async () => {
    const finalRole = customRole.trim() || selectedRole;
    if (!finalRole) return;

    try {
      await updateTargetRoleMutation.mutateAsync({ targetRole: finalRole });
      showSuccess("Target role saved successfully.");
      onComplete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="bg-[#0A0A0A] border-white/10 rounded-[24px] overflow-hidden max-w-5xl mx-auto w-full my-8">
      <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Job Targets</h2>
            <p className="text-sm text-white/60">Select a target role to help the AI tailor your resume.</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {suggestionsMutation.isPending ? (
          <div className="space-y-4">
            <p className="text-white/60 animate-pulse text-center">Analyzing your profile to find the best matching roles...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white/5 border-white/10 p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/2 bg-white/10" />
                    <Skeleton className="h-5 w-1/4 bg-white/10 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 bg-white/10 rounded-full" />
                    <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : suggestionsMutation.isError ? (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500">
            <AlertCircle className="size-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>
              We couldn't generate suggestions at this time. You can still manually enter your target role below.
            </AlertDescription>
          </Alert>
        ) : suggestions.length === 0 && hasRequested ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-lg text-white/80 font-medium">No specific suggestions found</p>
            <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
              We couldn't find exact matches based on your subjects, but you can enter your desired role below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suggestions.map((sug, index) => {
              const isSelected = selectedRole === sug.title;
              return (
                <Card
                  key={index}
                  className={`bg-[#111] p-6 cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "border-[#00CEC8] shadow-[0_0_20px_rgba(0,206,200,0.15)] scale-[1.02]"
                      : "border-white/10 hover:border-white/30 hover:bg-[#151515]"
                  }`}
                  onClick={() => handleSelectRole(sug.title)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white pr-4">{sug.title}</h3>
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#00CEC8] shrink-0" />
                    ) : (
                      <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 shrink-0">
                        {sug.roleType}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-white/60 mb-4 leading-relaxed line-clamp-3">
                    {sug.matchReason}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-bold">Key Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sug.importantSkills?.slice(0, 4).map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="border-white/20 text-xs font-medium text-white/90 bg-[#1A1A1A]">
                            {skill}
                          </Badge>
                        ))}
                        {sug.importantSkills?.length > 4 && (
                          <span className="text-white/50 text-xs flex items-center ml-1 font-medium">
                            +{sug.importantSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="pt-8 border-t border-white/10">
          <div className="max-w-md">
            <Label className="text-white/80 text-base font-bold mb-3 block">
              Have a specific role in mind?
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  if (e.target.value) setSelectedRole(null);
                }}
                placeholder="e.g. Frontend Developer Intern"
                className="bg-white/5 border-white/10 h-12 text-base flex-1 text-white"
              />
              <Button
                onClick={handleSaveTargetRole}
                disabled={(!selectedRole && !customRole.trim()) || updateTargetRoleMutation.isPending}
                className="h-12 px-8 bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold rounded-md"
              >
                {updateTargetRoleMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
