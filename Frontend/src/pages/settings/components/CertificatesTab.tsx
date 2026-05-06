import { useStudentCertifications } from "@/features/resume/api/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ExternalLink, Loader2, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CertificatesTab = () => {
  const { data: certificates = [], isLoading } = useStudentCertifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black tracking-tighter uppercase">Verified Credentials</h2>
           <p className="text-white/70 font-medium">Link and manage your verified certifications and awards</p>
        </div>
        <Button
          className="bg-white text-black font-black uppercase tracking-tight px-8 h-12 rounded-xl hover:bg-white/90 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Link New Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.length > 0 ? (
          certificates.map((cert: any, i: number) => (
            <Card key={i} className="bg-[#0A0A0A] border-white/10 hover:border-[#00CEC8]/30 transition-all group overflow-hidden">
               <CardContent className="p-6">
                  <div className="flex gap-5">
                     <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#00CEC8] group-hover:scale-110 transition-transform">
                        <Award className="w-8 h-8" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                           <h4 className="text-lg font-bold text-white truncate">{cert.name}</h4>
                           <ShieldCheck className="w-4 h-4 text-[#00CEC8] flex-shrink-0" />
                        </div>
                        <p className="text-sm text-white/70 font-medium mt-1">{cert.issuer}</p>
                        
                        <div className="flex items-center justify-between mt-6">
                           <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Issued {cert.issuedAt || "N/A"}</span>
                           <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-[#00CEC8] hover:bg-[#00CEC8]/10">
                              View Asset
                              <ExternalLink className="w-3 h-3 ml-2" />
                           </Button>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 py-24 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center bg-white/[0.01]">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-6">
               <Award className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-xl font-bold text-white/70">No certificates linked</h3>
            <p className="text-sm text-white/50 mt-2 max-w-xs">Upload or link your digital credentials to showcase your expertise.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesTab;
