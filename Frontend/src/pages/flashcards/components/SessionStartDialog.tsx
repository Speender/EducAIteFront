import * as React from "react";
import { ArrowRightIcon, HistoryIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { FlashcardLearnSessionResponseDto } from "@/features/flashcards/api/dto";

type SessionStartDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSession: FlashcardLearnSessionResponseDto | null;
  onContinue: () => void;
  onRestart: () => void;
  isResuming?: boolean;
  isRestarting?: boolean;
};

function formatRelative(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function SessionDialogBody({
  activeSession,
  onContinue,
  onRestart,
  onOpenChange,
  isResuming,
  isRestarting,
}: Omit<SessionStartDialogProps, "open">) {
  const [selectedAction, setSelectedAction] = React.useState<"continue" | "restart">("continue");

  React.useEffect(() => {
    if (!activeSession) return;
    setSelectedAction("continue");
  }, [activeSession?.sessionSqid]);

  if (!activeSession) return null;

  const completedCount = Math.min(activeSession.currentItemIndex, activeSession.items.length);
  const progress = activeSession.items.length > 0 ? (completedCount / activeSession.items.length) * 100 : 0;
  const isWorking = Boolean(isResuming || isRestarting);
  const lastActiveLabel = formatRelative(new Date(activeSession.lastActiveAt));

  // Format status for display
  const displayStatus = activeSession.status === "InProgress" ? "In Progress" : activeSession.status;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <Badge 
          variant="outline" 
          className="bg-primary/5 text-primary border-primary/20 font-medium px-2.5 py-0.5 text-[10px]"
        >
          {displayStatus}
        </Badge>
        <span className="text-[10px] text-white/30 font-medium tracking-wide">
          Last active {lastActiveLabel}
        </span>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 space-y-3">
        <div className="grid grid-cols-2 divide-x divide-white/5">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Index</span>
            <span className="text-base font-bold text-white leading-none">{activeSession.currentItemIndex + 1}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Total</span>
            <span className="text-base font-bold text-white leading-none">{activeSession.items.length}</span>
          </div>
        </div>
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-medium text-white/40">Progress</span>
            <span className="text-[10px] font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/5" />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <div className="bg-white/[0.03] p-1.5 rounded-[2.25rem] border border-white/5 shadow-inner">
          <ToggleGroup
            type="single"
            value={selectedAction}
            onValueChange={(v) => (v === "continue" || v === "restart") && setSelectedAction(v)}
            className="flex items-center gap-2"
          >
            <ToggleGroupItem
              value="continue"
              className={cn(
                "flex h-28 w-28 flex-col items-center justify-center gap-2.5 rounded-[1.75rem] border border-transparent transition-all duration-300",
                "hover:bg-white/[0.05] hover:border-white/10",
                "data-[state=on]:bg-primary/10 data-[state=on]:border-primary/40 data-[state=on]:shadow-[0_0_20px_rgba(var(--primary),0.1)]"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl bg-primary/10 p-2.5 transition-colors">
                  <HistoryIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-white text-[12px] tracking-tight">Resume</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="restart"
              className={cn(
                "flex h-28 w-28 flex-col items-center justify-center gap-2.5 rounded-[1.75rem] border border-transparent transition-all duration-300",
                "hover:bg-white/[0.05] hover:border-white/10",
                "data-[state=on]:bg-primary/10 data-[state=on]:border-primary/40 data-[state=on]:shadow-[0_0_20px_rgba(var(--primary),0.1)]"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl bg-primary/10 p-2.5 transition-colors">
                  <RotateCcwIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-white text-[12px] tracking-tight">Restart</span>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
        <Button
          variant="ghost"
          className="flex-1 text-white/30 hover:text-white hover:bg-white/5 transition-colors h-10 text-xs"
          onClick={() => onOpenChange(false)}
          disabled={isWorking}
        >
          Cancel
        </Button>
        <Button
          size="default"
          className="flex-[2] bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/10 h-10"
          disabled={isWorking}
          onClick={() => (selectedAction === "restart" ? onRestart() : onContinue())}
        >
          {isWorking ? (
            <Spinner className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowRightIcon className="mr-2 h-3.5 w-3.5" />
          )}
          {selectedAction === "restart" ? "Restart" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export function SessionStartDialog(props: SessionStartDialogProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!props.activeSession) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={props.open} onOpenChange={props.onOpenChange}>
        <DrawerContent className="bg-[#0a0a0a] text-white border-white/5 px-6 pb-8 max-h-[96vh] overflow-y-auto outline-none">
          <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-white/10" />
          <DrawerHeader className="px-0 pt-6 text-center">
            <DrawerTitle className="text-2xl font-black tracking-tight text-center">Unfinished Session</DrawerTitle>
            <DrawerDescription className="text-white/30 text-[13px] mt-1 text-center">
              Pick up where you left off or start fresh.
            </DrawerDescription>
          </DrawerHeader>
          <SessionDialogBody {...props} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-[400px] bg-[#0a0a0a] text-white border-white/10 shadow-2xl sm:rounded-[2.5rem] p-7 outline-none">
        <DialogHeader className="text-center mb-3">
          <DialogTitle className="text-2xl font-black tracking-tight text-center">Unfinished Session</DialogTitle>
          <DrawerDescription className="text-white/30 text-[13px] mt-0.5 text-center">
            We found an active session in progress.
          </DrawerDescription>
        </DialogHeader>
        <SessionDialogBody {...props} />
      </DialogContent>
    </Dialog>
  );
}
