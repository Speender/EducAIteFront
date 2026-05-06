import { useNavigate } from "react-router-dom";

import robotImg from "@/assets/robot.svg";
import { getAccessToken } from "@/lib/api/auth";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getAccessToken());

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,206,200,0.16),transparent_45%)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-[40px] border border-white/10 bg-[#050505]/95 px-8 py-12 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] lg:flex-row lg:text-left">
        <div className="flex justify-center lg:w-[280px] lg:flex-shrink-0">
          <img
            src={robotImg}
            alt="EducAIte robot"
            className="h-auto w-[180px] scale-x-[-1] object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)] lg:w-[240px]"
          />
        </div>

        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#00CEC8]">404 Not Found</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">This page does not exist.</h1>
          <p className="mt-4 text-base leading-8 text-white/65">
            The route you entered could not be found. The robot checked the coordinates, but there is nothing here yet.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <button
              type="button"
              onClick={() => navigate(isAuthenticated ? "/main" : "/login")}
              className="rounded-full bg-[#00CEC8] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_18px_rgba(0,206,200,0.28)] transition hover:bg-[#00b7b1]"
            >
              {isAuthenticated ? "Go to home" : "Go to login"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
