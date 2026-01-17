import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Book, Settings, BookOpen, AlertTriangle, RefreshCcw } from "lucide-react";
import type { sidepanelViews } from "@/types";
import { cn } from "@/lib/utils";
import { getDictionaries, getEntries } from "@/lib/storage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SidePanelMenuProps {
  onNavigate: (view: sidepanelViews) => void;
}

export function SidePanelMenu({ onNavigate }: SidePanelMenuProps) {
  const [dictionariesCount, setDictionariesCount] = useState(0);
  const [wordsCount, setWordsCount] = useState(0);
  const [statsStatus, setStatsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadStats = async () => {
    setStatsStatus("loading");
    setStatsError(null);

    try {
      const dictionaries = await getDictionaries();
      setDictionariesCount(dictionaries.length);

      const entriesByDictionary = await Promise.all(dictionaries.map((d) => getEntries(d.id)));
      const totalWords = entriesByDictionary.reduce((sum, entries) => sum + entries.length, 0);
      setWordsCount(totalWords);

      setStatsStatus("ready");
    } catch {
      setStatsStatus("error");
      setStatsError("Failed to load stats. Please try again.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads stats from chrome.storage (external system)
    void loadStats();
  }, []);

  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);
  const dictionariesValue =
    statsStatus === "ready" ? numberFormatter.format(dictionariesCount) : "—";
  const wordsValue = statsStatus === "ready" ? numberFormatter.format(wordsCount) : "—";

  return (
    <div className="flex h-full w-full flex-col bg-background dark text-foreground">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-linear-to-br from-card via-card to-secondary/40 shadow-xs">
          {/* Dark gradient accents */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-background/60 via-transparent to-background/30" />
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative flex items-center gap-3 p-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border/40 bg-primary/10 text-primary shadow-inner">
              <span className="text-lg font-bold">L</span>
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight text-foreground">Learnly</h1>
              <p className="text-xs text-muted-foreground">Save words. Practice daily.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-2 px-4 pb-4">
            <StatChip icon={Book} label="Dictionaries" value={dictionariesValue} />
            <StatChip icon={BookOpen} label="Words" value={wordsValue} />
          </div>

          {statsStatus === "error" && (
            <div className="relative px-4 pb-4">
              <Alert variant="destructive" className="rounded-2xl border-border/40">
                <AlertTriangle />
                <AlertTitle>Stats unavailable</AlertTitle>
                <AlertDescription className="w-full">
                  <p>{statsError}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => void loadStats()}
                  >
                    <RefreshCcw className="size-4" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-2">
        <MenuOption
          icon={<Book className="size-5" />}
          label="Dictionary"
          onClick={() => onNavigate("dictionary")}
          colorClass="text-primary bg-primary/10 group-hover:bg-primary/20"
        />
        <MenuOption
          icon={<BookOpen className="size-5" />}
          label="Flashcards"
          onClick={() => onNavigate("flashcards")}
          colorClass="text-primary bg-primary/10 group-hover:bg-primary/20"
        />
        <MenuOption
          icon={<Settings className="size-5" />}
          label="Settings"
          onClick={() => onNavigate("settings")}
          colorClass="text-primary bg-primary/10 group-hover:bg-primary/20"
        />
      </div>
    </div>
  );
}

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  colorClass: string;
}

function MenuOption({ icon, label, onClick, colorClass }: MenuOptionProps) {
  return (
    <Button
      variant="ghost"
      className="w-full h-14 justify-start px-4 py-2 bg-card border border-border/40 hover:bg-accent/50 rounded-2xl shadow-xs transition-all duration-200 group"
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-center justify-center p-2 rounded-xl mr-3 transition-colors",
          colorClass
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold text-foreground group-hover:text-foreground/80">
        {label}
      </span>
    </Button>
  );
}

type StatChipProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function StatChip({ icon: Icon, label, value }: StatChipProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-secondary/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="grid size-6 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-medium leading-none text-muted-foreground">{label}</div>
          <div className="mt-1 text-sm font-semibold leading-none text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}
