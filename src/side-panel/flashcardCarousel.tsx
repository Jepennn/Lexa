import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, Check, X } from "lucide-react";
import type { DictionaryEntry } from "@/types";

type FlashcardCarouselProps = {
  entries: DictionaryEntry[];
  onComplete?: () => void;
};

export function FlashcardCarousel({ entries, onComplete }: FlashcardCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Record<number, "correct" | "incorrect">>({});

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    // Set initial value
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleResult = (index: number, result: "correct" | "incorrect") => {
    setResults((prev) => ({ ...prev, [index]: result }));

    // Move to next card after a short delay
    setTimeout(() => {
      if (api && index < entries.length - 1) {
        api.scrollNext();
      } else if (index === entries.length - 1) {
        onComplete?.();
      }
    }, 300);
  };

  const handleReset = () => {
    setFlippedCards(new Set());
    setResults({});
    api?.scrollTo(0);
  };

  const correctCount = Object.values(results).filter((r) => r === "correct").length;
  const incorrectCount = Object.values(results).filter((r) => r === "incorrect").length;
  const isComplete = Object.keys(results).length === entries.length;

  if (entries.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="bg-muted/50 p-4 rounded-full mb-4">
          <RotateCcw className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No words to practice</p>
        <p className="text-xs text-muted-foreground mt-1">Add words to your dictionary first</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
        <div className="bg-primary/10 p-5 rounded-full">
          <Check className="size-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Session Complete!</h3>
          <p className="text-sm text-muted-foreground mt-1">You practiced {entries.length} words</p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{correctCount}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{incorrectCount}</div>
            <div className="text-xs text-muted-foreground">Needs Review</div>
          </div>
        </div>

        <Button onClick={handleReset} className="mt-4 gap-2">
          <RotateCcw className="size-4" />
          Practice Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Progress indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-muted-foreground font-medium">
          {current + 1} / {entries.length}
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-success font-medium">{correctCount} ✓</span>
          <span className="text-error font-medium">{incorrectCount} ✗</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((current + 1) / entries.length) * 100}%` }}
        />
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-2">
          {entries.map((entry, index) => {
            const isFlipped = flippedCards.has(index);
            const result = results[index];

            return (
              <CarouselItem key={entry.id} className="pl-2">
                <div className="perspective-1000">
                  <Card
                    onClick={() => !result && handleFlip(index)}
                    className={cn(
                      "relative min-h-[200px] cursor-pointer rounded-2xl border-border/40 shadow-md transition-all duration-500 transform-style-3d",
                      isFlipped && "rotate-y-180",
                      result === "correct" && "ring-2 ring-success/50 bg-success/5",
                      result === "incorrect" && "ring-2 ring-error/50 bg-error/5"
                    )}
                  >
                    {/* Front of card (word) */}
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden",
                        isFlipped && "invisible"
                      )}
                    >
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        Word
                      </span>
                      <h3 className="text-2xl font-bold text-foreground text-center">
                        {entry.text}
                      </h3>
                      <p className="text-[9px] text-muted-foreground mt-10">
                        Tap to reveal translation
                      </p>
                    </div>

                    {/* Back of card (translation) */}
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180",
                        !isFlipped && "invisible"
                      )}
                    >
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        Translation
                      </span>
                      <h3 className="text-2xl font-bold text-primary text-center">
                        {entry.translation}
                      </h3>

                      {!result && (
                        <div className="flex items-center gap-3 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-error/30 text-error hover:bg-error/10 hover:text-error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResult(index, "incorrect");
                            }}
                          >
                            <X className="size-4" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-success/30 text-success hover:bg-success/10 hover:text-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResult(index, "correct");
                            }}
                          >
                            <Check className="size-4" />
                            Got it
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-0 translate-x-0 disabled:opacity-30" />
        <CarouselNext className="right-0 translate-x-0 disabled:opacity-30" />
      </Carousel>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground text-center">
        Swipe or use arrows to navigate • Tap card to flip
      </p>
    </div>
  );
}
