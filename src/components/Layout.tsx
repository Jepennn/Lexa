import type{ ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppViews } from "@/types";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onNavigate: (view: AppViews) => void;
}

export function Layout({ children, title, subtitle, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-3 py-3">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        {/* Header with Navigation Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 text-foreground">
            <h1 className="bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-base font-semibold leading-tight text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Navigation Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[10px] bg-muted text-foreground hover:bg-muted/80"
              >
                ☰ Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 border-border p-1">
              <DropdownMenuLabel className="text-[10px] px-2 py-1">
                Navigation
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[10px] cursor-pointer py-1.5 px-2"
                onClick={() => onNavigate("introduction")}
              >
                🏠 Home
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[10px] cursor-pointer py-1.5 px-2"
                onClick={() => onNavigate("dictionary")}
              >
                📚 Dictionary
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[10px] cursor-pointer py-1.5 px-2"
                onClick={() => onNavigate("settings")}
              >
                ⚙️ Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

