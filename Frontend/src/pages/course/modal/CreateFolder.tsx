import { useEffect, useRef, useState } from 'react';

interface CreateFolderProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  onCreate: (folderName: string) => Promise<void>;
}

const DEFAULT_FOLDER_NAME = 'New Folder';

const CreateFolder = ({ isOpen, onClose, isSubmitting, errorMessage, onCreate }: CreateFolderProps) => {
  const [folderName, setFolderName] = useState(DEFAULT_FOLDER_NAME);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFolderName(DEFAULT_FOLDER_NAME);
    setHasTriedSubmit(false);

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isOpen]);

  const trimmedFolderName = folderName.trim();
  const validationMessage = hasTriedSubmit && !trimmedFolderName ? 'Folder name is required.' : null;

  async function handleCreate() {
    setHasTriedSubmit(true);
    if (!trimmedFolderName || isSubmitting) {
      return;
    }

    await onCreate(trimmedFolderName);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md transition-all duration-300"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md animate-in rounded-[32px] border border-white/20 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 text-white/60 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className="mb-3 mt-2 text-center text-xl font-medium tracking-wide text-white">
          Add New Folder
        </h3>
        <p className="mb-8 text-center text-sm text-white/50">
          Name your folder and it will be created in the current location.
        </p>

        <input
          ref={inputRef}
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void handleCreate();
            }

            if (event.key === 'Escape' && !isSubmitting) {
              event.preventDefault();
              onClose();
            }
          }}
          className="w-full rounded-[24px] border border-white/15 bg-white px-6 py-4 text-[15px] font-medium text-black outline-none transition focus:border-[#00CEC8] focus:ring-2 focus:ring-[#00CEC8]/20"
          title={trimmedFolderName || DEFAULT_FOLDER_NAME}
          maxLength={200}
        />

        <div className="min-h-7 px-1 pt-3 text-sm">
          {validationMessage ? (
            <p className="text-rose-300">{validationMessage}</p>
          ) : errorMessage ? (
            <p className="text-rose-300">{errorMessage}</p>
          ) : (
            <p className="text-white/35">This folder will appear in your current explorer view.</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleCreate()}
            disabled={isSubmitting || !trimmedFolderName}
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_50px_-10px_rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolder;
