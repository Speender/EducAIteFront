import { useEffect, useMemo, useRef, useState } from "react";

interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  onUpload: (file: File, documentName?: string) => Promise<void>;
}

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md";

const ImportFileModal = ({ isOpen, onClose, isSubmitting, errorMessage, onUpload }: ImportFileModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedFile(null);
    setDocumentName("");
  }, [isOpen]);

  const helperMessage = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    }

    if (!selectedFile) {
      return "Choose one file to upload into the current folder.";
    }

    return selectedFile.name;
  }, [errorMessage, selectedFile]);

  async function handleSubmit() {
    if (!selectedFile || isSubmitting) {
      return;
    }

    await onUpload(selectedFile, documentName.trim() || undefined);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-[620px] rounded-[32px] border border-white/15 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Import File</h2>
            <p className="mt-2 text-sm text-white/50">Upload a document into the current folder.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
          className="flex w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center transition hover:border-[#00CEC8]/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/70">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <p className="mt-4 text-lg font-medium text-white">{selectedFile ? "Change selected file" : "Choose a file to upload"}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">PDF, Word, PowerPoint, text</p>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS}
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null);
          }}
        />

        <div className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-white/70">Document name</label>
          <input
            type="text"
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            placeholder={selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Optional custom document name"}
            maxLength={200}
            disabled={isSubmitting}
            className="w-full rounded-[20px] border border-white/10 bg-white px-5 py-4 text-black outline-none transition focus:border-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div className={`mt-4 min-h-6 text-sm ${errorMessage ? "text-rose-300" : "text-white/45"}`}>
          {helperMessage}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !selectedFile}
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Uploading..." : "Upload file"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportFileModal;
