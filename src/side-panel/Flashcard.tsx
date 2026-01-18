import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BookOpen, ChevronRight, Layers } from "lucide-react";
import { FlashcardCarousel } from "./flashcardCarousel";
import { FlashcardConfig, type FlashcardSettings } from "./flashcardConfig";
import { getEntries, getDictionaries } from "@/lib/storage";
import type { Dictionary, DictionaryEntry } from "@/types";
import { cn } from "@/lib/utils";

type FlashcardProps = {
  onOpenDictionary?: () => void;
};

// Shuffle array helper function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Flashcard({ onOpenDictionary }: FlashcardProps) {
  const [isPracticing, setIsPracticing] = useState(false);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [hasDictionaries, setHasDictionaries] = useState<boolean | null>(null);
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [settings, setSettings] = useState<FlashcardSettings>({
    dictionaryId: null,
    shuffleCards: true,
    showWordFirst: true,
  });

  // Check if there are any dictionaries and fetches them.
  useEffect(() => {
    const checkDictionaries = async () => {
      console.log("checking dictionaries");
      try {
        const dicts = await getDictionaries();
        console.log("dicts", dicts.length);
        setDictionaries(dicts);
        setHasDictionaries(dicts.length > 0);
        if (dicts.length > 0 && !settings.dictionaryId) {
          setSettings((prev) => ({ ...prev, dictionaryId: dicts[0].id }));
        }
      } catch (error) {
        console.log("error", error);
        setHasDictionaries(false);
      }
    };
    checkDictionaries();
  }, [ settings.dictionaryId ]);

  // Fetch total word count across all dictionaries
  useEffect(() => {
    const fetchTotalWordCount = async () => {
      try {
        let total = 0;
        for (const dict of dictionaries) {
          const entries = await getEntries(dict.id);
          total += entries.length;
        }
        setTotalWordCount(total);
      } catch (error) {
        console.error("Failed to get total word count:", error);
      }
    };
    if (dictionaries.length > 0) {
      fetchTotalWordCount();
    }
  }, [dictionaries]);

  const handleStartPractice = async () => {
    if (!settings.dictionaryId) return;

    try {
      let wordEntries = await getEntries(settings.dictionaryId);
      
      // Shuffle if enabled
      if (settings.shuffleCards) {
        wordEntries = shuffleArray(wordEntries);
      }

      // Flip entries if showing translation first
      if (!settings.showWordFirst) {
        wordEntries = wordEntries.map((entry) => ({
          ...entry,
          text: entry.translation,
          translation: entry.text,
        }));
      }

      setEntries(wordEntries);
      setIsPracticing(true);
    } catch (error) {
      console.error("Failed to load entries:", error);
    }
  };

  //TODO: Will I like to let the user reapeat the incorrect cards?
  const handleComplete = () => {
  };

  // Reset practice state
  const handleExitPractice = () => {
    setIsPracticing(false);
    setEntries([]);
  };

  // Show practice mode
  if (isPracticing) {
    return (
      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitPractice}
            className="text-muted-foreground"
          >
            ← Exit
          </Button>
        </div>
        {/* GO through the code in this component. */}
        <FlashcardCarousel entries={entries} onComplete={handleComplete} />
      </div>
    );
  }

  // Show empty state if no dictionaries || DONE.
  if (hasDictionaries === false) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="flex flex-col items-center text-center max-w-[280px]">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-muted-foreground/10 blur-xl scale-150" />
            <div className="relative grid size-16 place-items-center rounded-2xl bg-brand-gradient shadow-lg">
              <BookOpen className="size-7 text-background" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            No Dictionaries Yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Create a dictionary and add some words to start practicing with flashcards.
          </p>
          <Button 
            onClick={onOpenDictionary}
            className="mt-6 gap-2 px-5"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (hasDictionaries === null) {
    return (
      <div className="flex h-full w-full items-center justify-center flex-col gap-4">
        <h3 className="text-md font-medium text-foreground">Loading dictionaries...</h3>
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  // Handle selecting a dictionary - update settings and open config
  const handleSelectDictionary = (dictionaryId: string) => {
    setSettings(prev => ({ ...prev, dictionaryId }));
    setIsConfigOpen(true);
  };

  // Show ready to practice state
  return (
    <div className="flex h-full w-full flex-col bg-background overflow-y-auto scrollbar-dark pb-6">
      {/* Header Section */}
      <div className="px-1 py-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Flashcards</h2>
        <p className="text-xs text-muted-foreground font-medium">Test your vocabulary</p>
      </div>

      {/* Flashcard Preview Hero */}
      <div className="relative flex items-center justify-center py-6 mb-2">
        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-28 w-44 rounded-3xl bg-primary/5 blur-3xl" />
        </div>
        
        {/* Stacked flashcard preview */}
        <div className="relative">
          {/* Back cards (decorative) */}
          <div className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-2xl border border-border/20 bg-card/50 shadow-sm" />
          <div className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-2xl border border-border/30 bg-card/70 shadow-md" />
          
          {/* Front card */}
          <div className="relative h-24 w-40 rounded-2xl border border-border/40 bg-card shadow-lg">
            <div className="flex h-full flex-col items-center justify-center gap-0.5">
              <Layers className="size-5 text-muted-foreground/60" />
              <span className="text-base font-bold text-foreground">
                {totalWordCount}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                total words
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-1 mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Choose a dictionary
        </h3>
      </div>

      {/* Dictionary List */}
      <div className="space-y-2.5">
        {dictionaries.map((dictionary) => (
          <DictionaryCard
            key={dictionary.id}
            dictionary={dictionary}
            isSelected={settings.dictionaryId === dictionary.id}
            onSelect={() => handleSelectDictionary(dictionary.id)}
          />
        ))}
      </div>

      {/* Hidden FlashcardConfig drawer */}
      <FlashcardConfig
        settings={settings}
        onSettingsChange={setSettings}
        onStartPractice={handleStartPractice}
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
      >
        <span className="hidden" />
      </FlashcardConfig>
    </div>
  );
}

// Dictionary Card Component
type DictionaryCardProps = {
  dictionary: Dictionary;
  isSelected: boolean;
  onSelect: () => void;
};

function DictionaryCard({ dictionary, isSelected, onSelect }: DictionaryCardProps) {
  const [wordCount, setWordCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const entries = await getEntries(dictionary.id);
        setWordCount(entries.length);
      } catch {
        setWordCount(0);
      }
    };
    fetchCount();
  }, [dictionary.id]);

  return (
    <Card 
      onClick={onSelect}
      className={cn(
        "group cursor-pointer rounded-2xl border-border/40 shadow-xs hover:bg-accent/30 hover:border-border/60 transition-all duration-200 active:scale-[0.99]",
        isSelected && "ring-1 ring-primary/50 border-primary/30"
      )}
    >
      <div className="p-4 flex items-center gap-3.5">
        {/* Dictionary Icon */}
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner",
          dictionary.color
        )}>
          <BookOpen className="text-white size-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="block font-semibold text-base text-foreground truncate">
            {dictionary.name}
          </span>
          {dictionary.description && (
            <span className="block text-xs text-muted-foreground truncate mt-0.5">
              {dictionary.description}
            </span>
          )}
        </div>

        {/* Word count badge */}
        <div className="flex flex-col items-center justify-center gap-0.5 min-w-[3rem]">
          <span className="text-lg font-bold text-foreground tabular-nums">{wordCount}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        {/* Chevron */}
        <ChevronRight className="size-5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      </div>
    </Card>
  );
}
