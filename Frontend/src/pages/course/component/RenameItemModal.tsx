import { useEffect, useRef, useState } from "react";

interface RenameItemModalProps {
  isOpen: boolean;
  title: string;
  initialName: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const RenameItemModal = ({
  isOpen,
  title,
  initialName,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: RenameItemModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialName);
    setHasTriedSubmit(false);

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [initialName, isOpen]);

  const trimmedName = name.trim();
  const validationMessage = hasTriedSubmit && !trimmedName ? "Name is required." : null;

  async function handleSubmit() {
    setHasTriedSubmit(true);
    if (!trimmedName || isSubmitting) {
      return;
    }

    await onSubmit(trimmedName);
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
        className="w-full max-w-md rounded-[32px] border border-white/15 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/50">Update the item name.</p>
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

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSubmit();
            }

            if (event.key === "Escape" && !isSubmitting) {
              event.preventDefault();
              onClose();
            }
          }}
          maxLength={200}
          className="w-full rounded-[24px] border border-white/15 bg-white px-6 py-4 text-[15px] font-medium text-black outline-none transition focus:border-[#00CEC8] focus:ring-2 focus:ring-[#00CEC8]/20"
        />

        <div className="min-h-7 px-1 pt-3 text-sm">
          {validationMessage ? (
            <p className="text-rose-300">{validationMessage}</p>
          ) : errorMessage ? (
            <p className="text-rose-300">{errorMessage}</p>
          ) : (
            <p className="text-white/35">Changes will update the current explorer immediately.</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
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
            disabled={isSubmitting || !trimmedName}
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameItemModal;
