import { Badge } from "@/components/ui/badge";
import { type CertificateStatus } from "../api/dto";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
}

export function CertificateStatusBadge({ status }: CertificateStatusBadgeProps) {
  const statusMap: Record<CertificateStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
    uploaded: { label: "Uploaded", variant: "secondary" },
    pending_processing: { label: "Pending", variant: "warning" },
    processing: { label: "Processing", variant: "info" },
    parsed: { label: "Parsed", variant: "success" },
    needs_review: { label: "Needs Review", variant: "warning" },
    verified_by_user: { label: "Verified", variant: "success" },
    failed: { label: "Failed", variant: "destructive" },
  };

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" };

  return <Badge variant={variant}>{label}</Badge>;
}
