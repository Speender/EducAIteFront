import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AiGenerationLoadingModal from "@/components/AiGenerationLoadingModal";
import StatusBanner from "@/components/StatusBanner";
import { useToast } from "@/components/ToastProvider";
import { useDocumentQuery, useDocumentSignedUrlQuery } from "@/features/documents/api/hooks";
import { useGenerateNoteFromDocumentMutation } from "@/features/notes/api/hooks";
import { getErrorMessage } from "@/lib/api/errors";

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const downloadButtonClass =
  "rounded-full bg-[#00CEC8] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_18px_rgba(0,206,200,0.28)] transition hover:bg-[#00b7b1]";

const DocumentDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentSqid } = useParams();
  const { showSuccess } = useToast();
  const documentQuery = useDocumentQuery(documentSqid ?? null);
  const signedUrlQuery = useDocumentSignedUrlQuery(documentSqid ?? null);
  const generateNoteMutation = useGenerateNoteFromDocumentMutation(documentSqid ?? null);
  const [viewerLoadFailed, setViewerLoadFailed] = useState(false);

  useEffect(() => {
    setViewerLoadFailed(false);
  }, [documentSqid, signedUrlQuery.data?.url]);

  const backTarget = useMemo(() => {
    const candidate = (location.state as { from?: string } | null)?.from;
    return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : "/courses";
  }, [location.state]);

  if (documentQuery.isPending || signedUrlQuery.isPending) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white lg:px-16">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-32 rounded-full bg-white/10" />
          <div className="h-20 rounded-[32px] border border-white/10 bg-white/5" />
          <div className="h-[72vh] rounded-[32px] border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  if (documentQuery.error || !documentQuery.data) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white lg:px-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-400/20 bg-rose-950/20 p-8">
          <button
            type="button"
            onClick={() => navigate(backTarget)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
          >
            Back
          </button>
          <h1 className="mt-6 text-3xl font-semibold">Unable to load document</h1>
          <p className="mt-3 text-white/70">{getErrorMessage(documentQuery.error)}</p>
        </div>
      </div>
    );
  }

  const document = documentQuery.data;
  const signedUrl = signedUrlQuery.data?.url ?? "";
  const viewerUrl = signedUrl ? `${signedUrl}${signedUrl.includes("#") ? "" : "#toolbar=0&navpanes=0&scrollbar=1&view=FitH"}` : "";

  async function handleGenerateNote() {
    try {
      const result = await generateNoteMutation.mutateAsync({ expiresInMinutes: 60 });
      if (result.source === "generated") {
        showSuccess("Note generated successfully.");
      } else {
        showSuccess("Existing note opened.");
      }
      navigate(`/notes/${result.note.sqid}`, {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
    } catch {
      // mutation error is rendered inline
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white lg:px-16">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(backTarget)}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
        >
          Back to files
        </button>

        <header className="mt-8 rounded-[32px] border border-white/10 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#00CEC8]">Document Viewer</p>
              <h1
                title={document.documentName}
                className="mt-4 truncate overflow-hidden whitespace-nowrap text-4xl font-semibold tracking-tight lg:text-5xl"
              >
                {document.documentName}
              </h1>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  Updated {formatDateLabel(document.updatedAt)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  In-app reader
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <button
                type="button"
                onClick={() => void handleGenerateNote()}
                disabled={generateNoteMutation.isPending}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generateNoteMutation.isPending ? "Generating note..." : "Generate note"}
              </button>
              {signedUrl && (
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={downloadButtonClass}
                >
                  Download
                </a>
              )}
            </div>
          </div>

          {generateNoteMutation.error ? (
            <StatusBanner
              message={getErrorMessage(generateNoteMutation.error)}
              tone="error"
              className="mt-6"
            />
          ) : null}
        </header>

        <section className="mt-8 rounded-[32px] border border-white/10 bg-[#050505] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Reading area</h2>
              <p className="mt-2 text-sm text-white/55">
                View the document in-app and use download when you need the original file.
              </p>
            </div>
          </div>

          <div className="h-[72vh] overflow-auto rounded-[28px] border border-white/10 bg-black/30">
            {signedUrlQuery.error && (
              <div className="flex h-full items-center justify-center px-6">
                <div className="max-w-xl rounded-[24px] border border-rose-400/20 bg-rose-950/20 p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white">Unable to open document</h3>
                  <p className="mt-3 text-white/70">{getErrorMessage(signedUrlQuery.error)}</p>
                </div>
              </div>
            )}

            {!signedUrlQuery.error && viewerLoadFailed && (
              <div className="flex h-full items-center justify-center px-6">
                <div className="max-w-xl rounded-[24px] border border-white/10 bg-[#090909] p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white">Preview unavailable</h3>
                  <p className="mt-3 text-white/65">
                    This file could not be rendered inside the in-app reading area. You can still use the secure download action above.
                  </p>
                </div>
              </div>
            )}

            {!signedUrlQuery.error && !viewerLoadFailed && signedUrl && (
              <iframe
                src={viewerUrl}
                title={document.documentName}
                className="h-full min-h-[72vh] w-full rounded-[28px] bg-white"
                onError={() => setViewerLoadFailed(true)}
              />
            )}
          </div>
        </section>
      </div>

      <AiGenerationLoadingModal
        open={generateNoteMutation.isPending}
        title="Generating your note"
        subtitle="educAIte is turning this document into a structured learning note. This can take a moment depending on document size."
        stages={[
          { label: "Fetching data...", description: "Loading the selected document and preparing the secure source." },
          { label: "Processing input...", description: "Extracting the document content and organizing the key study material." },
          { label: "Generating content...", description: "Creating the note draft with readable sections and study-ready structure." },
          { label: "Finalizing result...", description: "Saving the generated note and preparing the note page." },
        ]}
      />
    </div>
  );
};

export default DocumentDetailsPage;
