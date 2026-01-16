import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

type PracticeProps = {
  onOpenDictionary?: () => void;
};

export function Practice({ onOpenDictionary }: PracticeProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Card className="rounded-2xl border-border/40 shadow-xs">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">Practice</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Flashcards & quizzes coming soon. For now, add a few words to your dictionaries and
                we’ll use them here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/40 shadow-xs">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              Start by adding words
            </div>
            <Button variant="secondary" onClick={onOpenDictionary}>
              Open Dictionary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
