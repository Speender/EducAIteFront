import { useState } from "react";
import { Award, Upload, Filter, Search } from "lucide-react";
import { CertificateList } from "@/features/certificates/components/CertificateList";
import { CertificateUploadDialog } from "@/features/certificates/components/CertificateUploadDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CertificatesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#00CEC8]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-[#00CEC8]/10 text-[#00CEC8] border-[#00CEC8]/20 mb-2 px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-black">
              Achievement Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
              <Award className="size-10 text-[#00CEC8]" />
              My Certificates
            </h1>
            <p className="text-white/60 text-lg max-w-2xl font-medium">
              Manage your achievements and use AI to automatically parse and integrate them into your resume.
            </p>
          </div>
          <Button 
            onClick={() => setIsUploadOpen(true)} 
            className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold px-6 py-6 h-auto rounded-2xl"
          >
            <Upload className="mr-2 size-5" />
            Upload Certificate
          </Button>
        </div>

        {/* Filters/Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#0D0D0D] p-4 rounded-2xl border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <Input
              placeholder="Search certificates..."
              className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#00CEC8]/50 transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5">
            <Filter className="size-5" />
          </Button>
        </div>

        {/* List */}
        <CertificateList />
      </div>

      {/* Upload Dialog */}
      <CertificateUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
      />
    </div>
  );
}
