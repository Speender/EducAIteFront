interface DeleteItemModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteItemModal = ({
  isOpen,
  title,
  itemName,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteItemModalProps) => {
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
        className="w-full max-w-md rounded-[32px] border border-rose-400/20 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/55">
            This will delete <span className="font-semibold text-white" title={itemName}>{itemName}</span>.
          </p>
        </div>

        <div className="min-h-7 text-sm">
          {errorMessage ? (
            <p className="text-rose-300">{errorMessage}</p>
          ) : (
            <p className="text-white/35">This action cannot be undone from the explorer.</p>
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
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(244,63,94,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
