import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingRedirectProps {
  onOpenSidePanel: () => void;
}

export function OnboardingRedirect({ onOpenSidePanel }: OnboardingRedirectProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background p-4 items-center justify-between animate-in fade-in duration-500">
      {/* Visual Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full py-6">
        <div className="relative group cursor-default">
          <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-brand-purple/20 to-primary/20 rounded-full blur-2xl opacity-70 animate-pulse" />
          <div className="relative h-20 w-20 bg-secondary/30 rounded-3xl flex items-center justify-center border border-border/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="size-10 text-primary" />
          </div>
        </div>

        <div className="space-y-3 text-center max-w-[280px]">
          <h2 className="font-bold text-2xl tracking-tight text-foreground">Welcome to Learnly</h2>
          <p className="text-sm text-muted-foreground leading-relaxed px-2">
            Your local AI translation language companion.
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full flex flex-col gap-4 pt-4 pb-2">
        <Button
          className="w-full h-12 font-semibold shadow-lg group relative overflow-hidden text-base rounded-xl cursor-pointer"
          onClick={onOpenSidePanel}
        >
          <span className="relative z-10 flex items-center gap-2">
            Get started
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Button>

        <p className="text-center text-[8px] text-muted-foreground/40 uppercase tracking-[0.2em] font-semibold">
          Setup takes less than a minute
        </p>
      </div>
    </div>
  );
}
