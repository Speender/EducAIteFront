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
            className="w-full max-w-[340px] rounded-[28px] border border-white/10 bg-[#050505] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00CEC8]/20 bg-[#00CEC8]/10">
                <motion.div
                  animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 0.9, repeat: Infinity, ease: "linear" }
                  }
                  className="h-6 w-6 rounded-full border-2 border-[#00CEC8]/25 border-t-[#00CEC8]"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm text-white/48">
                {subtitle || stages[0]?.label || "Generating..."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AiGenerationLoadingModal;
