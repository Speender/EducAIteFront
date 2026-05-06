import { useState, useCallback, useEffect } from "react";
import { Upload, X, FileText, ImageIcon, Loader2 } from "lucide-react";
import {
  useUploadCertificatesMutation,
  useCertificateProcessingStatusQuery,
} from "../api/hooks";
import { useToast } from "@/components/ToastProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CertificateReviewModal } from "./CertificateReviewModal";

function ProcessingItem({
  sqid,
  fileName,
  onReview,
}: {
  sqid: string;
  fileName: string;
  onReview: (sqid: string) => void;
}) {
  const { data } = useCertificateProcessingStatusQuery(sqid);

  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
      <div className="flex flex-col truncate pr-4">
        <span className="truncate text-sm font-medium">{fileName}</span>
        <span className="text-xs text-muted-foreground capitalize">
          {data?.status || "Starting..."}
        </span>
      </div>
      <div className="shrink-0">
        {data?.status === "completed" ? (
          <Button size="sm" onClick={() => onReview(sqid)}>
            Review
          </Button>
        ) : data?.status === "failed" ? (
          <span className="text-xs font-bold text-destructive">Failed</span>
        ) : (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

interface CertificateUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CertificateUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: CertificateUploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<{ sqid: string; fileName: string }[]>([]);
  const [isProcessingPhase, setIsProcessingPhase] = useState(false);
  const [reviewSqid, setReviewSqid] = useState<string | null>(null);

  const { showSuccess } = useToast();
  const uploadMutation = useUploadCertificatesMutation();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFiles([]);
      setUploadedItems([]);
      setIsProcessingPhase(false);
      setReviewSqid(null);
    }
  }, [open]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndAddFiles = useCallback((newFiles: File[]) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 20;

    const filtered = newFiles.filter((file) => {
      if (!validTypes.includes(file.type)) {
        console.warn(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        console.warn(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    setFiles((prev) => {
      const combined = [...prev, ...filtered];
      return combined.slice(0, maxFiles);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    },
    [validateAndAddFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        validateAndAddFiles(selectedFiles);
      }
    },
    [validateAndAddFiles]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndProcess = async () => {
    if (files.length === 0) return;

    try {
      // 1. Upload files with autoProcess = true
      const res = await uploadMutation.mutateAsync({
        files,
        source: "resume_builder",
        autoProcess: true,
      });

      const items = res.items.map((i) => ({
        sqid: i.certificationSqid,
        fileName: i.fileName,
      }));

      setUploadedItems(items);
      setIsProcessingPhase(true);

      showSuccess(`Successfully uploaded ${files.length} certificate(s). Processing started.`);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (isProcessingPhase) {
      onSuccess?.(); // Refresh list if closing while/after processing
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isProcessingPhase ? "Processing Certificates" : "Upload Certificates"}
            </DialogTitle>
            <DialogDescription>
              {isProcessingPhase
                ? "Please wait while we parse your certificates using AI."
                : "Upload your certificates in PDF, JPEG, or PNG format. Max 10MB per file."}
            </DialogDescription>
          </DialogHeader>

          {!isProcessingPhase ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/20 hover:border-primary/50"
                )}
              >
                <Upload className="mb-4 size-10 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  Drag & drop files here, or{" "}
                  <label className="cursor-pointer text-primary hover:underline">
                    browse
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">PDF, JPEG, or PNG (Max 10MB)</p>
              </div>

              {files.length > 0 && (
                <div className="mt-6 max-h-[200px] overflow-y-auto pr-2">
                  <div className="flex flex-col gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="flex items-center gap-3 truncate">
                          {file.type === "application/pdf" ? (
                            <FileText className="size-5 text-blue-500" />
                          ) : (
                            <ImageIcon className="size-5 text-emerald-500" />
                          )}
                          <div className="truncate text-sm">
                            <p className="truncate font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => removeFile(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>Failed to upload certificates. Please try again.</AlertDescription>
                </Alert>
              )}

              {uploadMutation.isPending && (
                <div className="mt-4 space-y-2">
                  <Progress value={undefined} className="h-1" />
                  <p className="text-center text-xs text-muted-foreground">Uploading...</p>
                </div>
              )}

              <DialogFooter className="mt-6">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadAndProcess}
                  disabled={files.length === 0 || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload and Parse"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            // Processing Phase UI
            <div className="mt-6 space-y-4">
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {uploadedItems.map((item) => (
                  <ProcessingItem
                    key={item.sqid}
                    sqid={item.sqid}
                    fileName={item.fileName}
                    onReview={(sqid) => setReviewSqid(sqid)}
                  />
                ))}
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose}>
                  Close (Processing continues in background)
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Modal spawned from polling */}
      <CertificateReviewModal
        certificationSqid={reviewSqid}
        open={!!reviewSqid}
        onOpenChange={(isOpen) => !isOpen && setReviewSqid(null)}
      />
    </>
  );
}
