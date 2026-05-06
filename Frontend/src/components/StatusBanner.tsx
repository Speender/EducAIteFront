interface StatusBannerProps {
  message: string;
  tone?: "success" | "error" | "info";
  className?: string;
}

const toneClasses: Record<NonNullable<StatusBannerProps["tone"]>, string> = {
  success: "border-[#00CEC8]/20 bg-[#00CEC8]/10 text-[#9ef6f3]",
  error: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  info: "border-white/10 bg-white/[0.04] text-white/75",
};

const StatusBanner = ({ message, tone = "success", className = "" }: StatusBannerProps) => (
  <div className={`rounded-[24px] border px-5 py-4 text-sm ${toneClasses[tone]} ${className}`.trim()}>
    {message}
  </div>
);

export default StatusBanner;
