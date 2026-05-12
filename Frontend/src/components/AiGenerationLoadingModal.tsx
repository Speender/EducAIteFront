import { useEffect, useState } from "react";
import { FileSearch } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AiGenerationStage = {
  label: string;
  description: string;
};

interface AiGenerationLoadingModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  stages: AiGenerationStage[];
}

const AiGenerationLoadingModal = ({
  open,
  title,
  subtitle,
  stages,
}: AiGenerationLoadingModalProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const activeStageIndex = Math.min(stages.length - 1, Math.floor((elapsedSeconds * 1000) / 2200));
  const activeStage = stages[activeStageIndex] ?? stages[0] ?? { label: "Generating", description: subtitle };
  const progressValue = Math.min(
    96,
    Math.max(14, Math.round(((activeStageIndex + 1) / Math.max(stages.length, 1)) * 100)),
  );

  useEffect(() => {
    if (!open) {
      setElapsedSeconds(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-[320] flex items-center justify-center bg-black/72 px-6 backdrop-blur-md"
        >
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_12%_0%,rgba(0,206,200,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-5 py-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(90deg,transparent,rgba(0,206,200,0.055),transparent)]" />

            <div className="relative flex gap-4">
              <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#00CEC8]/20 bg-[#00CEC8]/[0.08] shadow-[0_0_34px_rgba(0,206,200,0.13)]">
                <span className="absolute inset-0 rounded-2xl border border-[#00CEC8]/20 animate-pulse" />
                <span className="absolute size-9 rounded-full bg-[#00CEC8]/10 blur-md" />
                <FileSearch className="relative size-6 text-[#00CEC8] drop-shadow-[0_0_14px_rgba(0,206,200,0.6)]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  AI generation
                </p>
                <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-white/60">{subtitle}</p>

                <div key={activeStage.label} className="mt-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
                  <p className="text-sm font-medium text-[#43F3EE] drop-shadow-[0_0_14px_rgba(0,206,200,0.35)]">
                    {activeStage.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/50">{activeStage.description}</p>
                </div>
              </div>
            </div>

            <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-[#00CEC8] shadow-[0_0_18px_rgba(0,206,200,0.65)] transition-all duration-700 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AiGenerationLoadingModal;
