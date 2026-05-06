import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: "success" | "error";
}

export function SuccessToast({ show, message, onClose, duration = 4000, variant = "success" }: SuccessToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  return (
    <AnimatePresence>
      {show ? (
        <div className="fixed right-4 top-4 z-[330] px-2 sm:right-6 sm:top-6">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "flex max-w-[92vw] items-center gap-4 rounded-full border py-3 pl-4 pr-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md",
              variant === "error"
                ? "border-red-500/35 bg-red-500/10"
                : "border-white/10 bg-[#0A0A0A]",
            )}
          >
            <div
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full",
                variant === "error" ? "bg-red-500/15 text-red-300" : "bg-[#00CEC8]/10 text-[#00CEC8]",
              )}
            >
              {variant === "error" ? <AlertCircle size={18} strokeWidth={2.5} /> : <CheckCircle2 size={18} strokeWidth={2.5} />}
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-md",
                  variant === "error" ? "bg-red-500/20" : "bg-[#00CEC8]/20",
                )}
              />
            </div>

            <span className={cn("px-2 text-sm font-medium tracking-tight", variant === "error" ? "text-red-100" : "text-white/90")}>
              {message}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-white/20 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              <X size={14} />
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default SuccessToast;
