import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type SidePanelLayoutProps = {
  title: string;
  onBack: () => void;
  children: ReactNode;
};

export function SidePanelLayout({ title, onBack, children }: SidePanelLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-background dark text-foreground">
      {/* Header for Pages */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-card shadow-xs z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-muted text-foreground hover:bg-muted/80 shadow-sm"
          onClick={onBack}
        >
          <ChevronLeft className="size-5" />
        </Button>

        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-dark p-4 bg-background" id="side-panel-content">
        {children}
      </div>
    </div>
  );
}
