import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

import SuccessToast from "./SuccessToast";

type ToastItem = {
  id: number;
  message: string;
  variant: "success" | "error";
};

type ToastContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback((message: string, variant: "success" | "error") => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    nextIdRef.current += 1;
    setQueue((current) => [...current, { id: nextIdRef.current, message: trimmedMessage, variant }]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "error");
  }, [showToast]);

  const handleClose = useCallback(() => {
    setQueue((current) => current.slice(1));
  }, []);

  const value = useMemo(
    () => ({
      showSuccess,
      showError,
    }),
    [showSuccess, showError],
  );

  const activeToast = queue[0] ?? null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SuccessToast
        show={Boolean(activeToast)}
        message={activeToast?.message ?? ""}
        variant={activeToast?.variant ?? "success"}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
