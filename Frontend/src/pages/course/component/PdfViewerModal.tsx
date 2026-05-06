type PdfViewerModalProps = {
  title: string;
  status: "loading" | "ready" | "error";
  url: string;
  onClose: () => void;
};

const PdfViewerModal = ({ title, status, url, onClose }: PdfViewerModalProps) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-6 py-10 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#00CEC8]">PDF Viewer</p>
            <h3 className="mt-2 truncate text-xl font-semibold text-white" title={title}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {status === "ready" && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-[#00CEC8] hover:text-[#00CEC8]"
              >
                Open in new tab
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-black/40 p-4">
          {status === "loading" && (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#00CEC8]" />
              <p className="mt-4 text-white/65">Loading secure PDF...</p>
            </div>
          )}

          {status === "error" && (
            <div className="max-w-xl rounded-[24px] border border-rose-400/20 bg-rose-950/20 p-8 text-center">
              <h4 className="text-xl font-semibold text-white">Unable to open PDF</h4>
              <p className="mt-3 text-white/65">
                We could not retrieve a signed viewing URL for this file.
              </p>
            </div>
          )}

          {status === "ready" && (
            <iframe
              src={url}
              title={title}
              className="h-full min-h-[70vh] w-full rounded-[24px] border border-white/10 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
