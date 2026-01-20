import { useEffect, useState } from "react";
import { X, Volume2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getDictionaries, addEntry } from "@/lib/storage";
import { DictionarySelectionPopover } from "./DictionarySelectionPopover";
import { toast } from "@/components/ui/sonner";

//Importing custom types
import type { TranslationMessage, Dictionary } from "@/types";

export function TooltipTranslation() {
  const [originalText, setOriginalText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [addedToDictionary, setAddedToDictionary] = useState<string | null>(null);

  // Store user settings from the message
  const [voiceMode, setVoiceMode] = useState<boolean>(true);
  const [dictionaryMode, setDictionaryMode] = useState<boolean>(true);
  const [sourceLang, setSourceLang] = useState<string>("en");

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Use the speech synthesis hook
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  // Extract translation logic into a reusable function
  const performTranslation = async (message: TranslationMessage) => {
    // Store the original text from the message
    setOriginalText(message.text);

    // Update settings from the message
    setVoiceMode(message.voiceMode);
    setDictionaryMode(message.dictionaryMode);
    setSourceLang(message.sourceLang);

    // Get the current selection position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position the tooltip above the selected text
      // Add scroll offsets to handle scrolled pages
      setPosition({
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY,
      });
    }

    // Show the overlay with loading state
    setIsVisible(true);
    setIsLoading(true);
    setIsDownloading(false);
    setTranslatedText("");
    setAddedToDictionary(null);

    try {
      //Check if the user has the necessary capabilities to translate the text
      const translatorCapabilities = await Translator.availability({
        sourceLanguage: message.sourceLang,
        targetLanguage: message.targetLang,
      });

      if (translatorCapabilities === "unavailable") {
        setTranslatedText("Translation unavailable for this language");
        setIsLoading(false);
        return;
      }

      // Create translator (this might take time if model needs to be downloaded)
      const translator = await Translator.create({
        sourceLanguage: message.sourceLang,
        targetLanguage: message.targetLang,
        monitor(m) {
          m.addEventListener("downloadprogress", () => {
            setIsDownloading(true);
          });
        },
      });

      // Translate the text
      const translated = await translator.translate(message.text);
      setTranslatedText(translated);
    } catch {
      setTranslatedText("Translation failed. Please try again.");
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDownloading(false);
    }
  };

  useEffect(()=>{

    const fetchDictionaries = async () => {
      const dictionaries = await getDictionaries();

      if (dictionaries.length > 0) {
        setDictionaries(dictionaries);
      } else {
        setDictionaries([]);
      }
    };

    //Actually fetches the dictionaries
    fetchDictionaries();
  }, []);

  useEffect(() => {
    const messageListener = async (message: TranslationMessage) => {
      // Handle keyboard shortcut
      if (message.action === "SHOW_TRANSLATION_SHORTCUT") {
        const selection = window.getSelection();
        const selectionText = selection?.toString().trim();

        // If no selection text, just return
        if (!selectionText) {
          return;
        }

        const userSettings = await chrome.storage.sync.get([
          "sourceLang",
          "targetLang",
          "voiceMode",
          "dictionaryMode",
        ]);

        // Call the translation function directly
        await performTranslation({
          action: "SHOW_TRANSLATION",
          text: selectionText,
          length: selectionText.length,
          sourceLang: userSettings.sourceLang,
          targetLang: userSettings.targetLang,
          voiceMode: userSettings.voiceMode,
          dictionaryMode: userSettings.dictionaryMode,
        } as TranslationMessage);
      }

      // Handle context menu translation
      if (message.action === "SHOW_TRANSLATION") {
        await performTranslation(message);
      }

      return true; // Keep the message listener alive
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup: remove listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []); 

  // Handler functions for toolbar actions
  const handleSpeak = () => {
    if (originalText && sourceLang) {
      speak(originalText, sourceLang);
    }
  };

  // Handle adding word to dictionary
  const handleAddToDictionary = async (dictionaryId: string) => {
    if (!originalText || !translatedText) return;
    
    try {
      await addEntry(dictionaryId, originalText, translatedText);
      setAddedToDictionary(dictionaryId);
      toast.success("Added to dictionary");
      // Reset success state after 2 seconds
      setTimeout(() => setAddedToDictionary(null), 2000);
    } catch {
      toast.error("Failed to add to dictionary");
    }
  };



  const handleClose = () => {
    cancel(); // Cancel any ongoing speech
    setIsVisible(false);
    setOriginalText("");
    setTranslatedText("");
    setIsLoading(false);
    setAddedToDictionary(null);
  };

  //TODO: Maybe move this logic to a custom hook

  //If no translation is requested, return no UI
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="absolute z-999998 min-w-[220px] max-w-[380px] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`, // 10px above the selection
        transform: "translate(-50%, -100%)", // Center horizontally and position above
      }}
    >
      <div className="rounded-xl border border-border bg-card p-3 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="space-y-2.5">
          {/* Header with close button */}
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-primary ring-2 ring-primary/40" />
              Translation
            </Badge>
            <div className="flex items-center gap-1">
              {/* Options bar */}
              <div className="flex items-center gap-0.5 rounded-md border border-border/50 bg-muted/30 px-1 py-0.5">
                {/* Voice mode button */}
                {voiceMode && (
                  <button
                    onClick={handleSpeak}
                    disabled={!originalText || isLoading}
                    className="rounded px-1 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className={`size-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                  </button>
                )}

                {/* Dictionary mode button */}
                {dictionaryMode && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="rounded px-1 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                        title="Add to dictionary"
                        disabled={!originalText || isLoading}
                      >
                        <BookOpen className="size-3.5" />
                      </button>
                    </PopoverTrigger>
                    <DictionarySelectionPopover
                      dictionaries={dictionaries}
                      onDictionarySelect={handleAddToDictionary}
                      addedToDictionaryId={addedToDictionary}
                      className="z-50"
                      side="right"
                      align="start"
                      sideOffset={50}
                    />
                  </Popover>
                )}

              </div>

              {/* Close button */}
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleClose}
                className="size-6 text-muted-foreground hover:text-foreground"
                aria-label="Close translation"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Translation text or loading spinner */}
          {isLoading ? (
            <div className="flex items-center gap-2 py-2">
              <Spinner className="size-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                {isDownloading ? "Downloading language model..." : "Translating..."}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground">{translatedText}</p>
          )}
        </div>
      </div>
    </div>
  );
}


