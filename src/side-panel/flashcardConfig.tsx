import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, Shuffle, BookOpen } from "lucide-react";
import { getDictionaries } from "@/lib/storage";
import type { Dictionary } from "@/types";

export type FlashcardSettings = {
  dictionaryId: string | null;
  shuffleCards: boolean;
  showWordFirst: boolean;
};

type FlashcardConfigProps = {
  settings: FlashcardSettings;
  onSettingsChange: (settings: FlashcardSettings) => void;
  onStartPractice: () => void;
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function FlashcardConfig({
  settings,
  onSettingsChange,
  onStartPractice,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: FlashcardConfigProps) {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Support both controlled and uncontrolled modes
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

  useEffect(() => {
    const loadDictionaries = async () => {
      setIsLoading(true);
      try {
        const data = await getDictionaries();
        setDictionaries(data);

        // Auto-select first dictionary if none selected
        if (!settings.dictionaryId && data.length > 0) {
          onSettingsChange({ ...settings, dictionaryId: data[0].id });
        }
      } catch (error) {
        console.error("Failed to load dictionaries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDictionaries();
  }, []);

  const handleStartPractice = () => {
    setIsOpen(false);
    onStartPractice();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="size-4" />
            Configure
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Settings2 className="size-5" />
              Practice Settings
            </DrawerTitle>
            <DrawerDescription>Configure your flashcard session before starting</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-6">
            {/* Dictionary Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Dictionary</Label>
              {isLoading ? (
                <div className="h-9 bg-muted/50 rounded-md animate-pulse" />
              ) : dictionaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No dictionaries available. Create one first.
                </p>
              ) : (
                <Select
                  value={settings.dictionaryId || undefined}
                  onValueChange={(value) => onSettingsChange({ ...settings, dictionaryId: value })}
                >
                  <SelectTrigger className="w-full text-muted-foreground">
                    <SelectValue placeholder="Select a dictionary" className="text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent>
                    {dictionaries.map((dict) => (
                      <SelectItem key={dict.id} value={dict.id}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className={`size-2.5 rounded-full ${dict.color}`} />
                          {dict.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Settings Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Shuffle className="size-4" />
                  </div>
                  <div>
                    <Label htmlFor="shuffle" className="text-sm font-medium text-foreground">
                      Shuffle cards
                    </Label>
                    <p className="text-xs text-muted-foreground">Randomize card order</p>
                  </div>
                </div>
                <Switch
                  id="shuffle"
                  checked={settings.shuffleCards}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, shuffleCards: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <Label htmlFor="word-first" className="text-sm font-medium text-foreground">
                      Show word first
                    </Label>
                    <p className="text-xs text-muted-foreground">Start with original word</p>
                  </div>
                </div>
                <Switch
                  id="word-first"
                  checked={settings.showWordFirst}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, showWordFirst: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-6">
            <Button
              onClick={handleStartPractice}
              disabled={!settings.dictionaryId || dictionaries.length === 0}
              className="w-full"
            >
              Start Practice
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
