import { useState } from "react";
import { MoreVertical, Eye, Trash2, FileText, Award } from "lucide-react";
import { useCertificatesQuery, useDeleteCertificateMutation } from "../api/hooks";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { CertificateReviewModal } from "./CertificateReviewModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CertificateList() {
  const [params] = useState({ page: 1, pageSize: 10 });
  const { data, isLoading } = useCertificatesQuery(params);
  const deleteMutation = useDeleteCertificateMutation();

  const [reviewSqid, setReviewSqid] = useState<string | null>(null);
  const [deleteSqid, setDeleteSqid] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteSqid) {
      await deleteMutation.mutateAsync(deleteSqid);
      setDeleteSqid(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No certificates found</EmptyTitle>
          <EmptyDescription>
            Upload your certificates to get started with AI-powered parsing.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/95 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-5 pl-8">Certificate Name</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-5">Institution</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-5">Date</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-5 text-center">Status</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-5 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((cert) => (
              <TableRow key={cert.certificationSqid} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="font-bold text-white py-5 pl-8 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8] group-hover:bg-[#00CEC8]/20 transition-colors">
                      <Award className="size-4" />
                    </div>
                    {cert.achievementName || "Untitled Certificate"}
                  </div>
                </TableCell>
                <TableCell className="text-white/60 font-medium">{cert.institution || "-"}</TableCell>
                <TableCell className="text-white/40 font-mono text-xs">{cert.issuedDate || "-"}</TableCell>
                <TableCell className="text-center">
                  <CertificateStatusBadge status={cert.status} />
                </TableCell>
                <TableCell className="text-right pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-9 rounded-xl hover:bg-white/10 hover:text-[#00CEC8] transition-all">
                        <MoreVertical className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-white/10 text-white rounded-xl shadow-2xl p-1.5 min-w-[160px]">
                      <DropdownMenuItem 
                        onClick={() => setReviewSqid(cert.certificationSqid)}
                        className="rounded-lg gap-2 cursor-pointer focus:bg-[#00CEC8] focus:text-black font-bold py-2.5"
                      >
                        <Eye className="size-4" />
                        View & Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-500 focus:text-white font-bold py-2.5"
                        onClick={() => setDeleteSqid(cert.certificationSqid)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CertificateReviewModal
        certificationSqid={reviewSqid}
        open={!!reviewSqid}
        onOpenChange={(open) => !open && setReviewSqid(null)}
      />

      <AlertDialog open={!!deleteSqid} onOpenChange={(open) => !open && setDeleteSqid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the certificate
              and remove it from any resumes it's attached to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
