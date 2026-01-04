import { useEffect, useState } from "react";
import { X, Volume2, BookOpen, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

//Importing custom types
import type { TranslationMessage } from "./types";

export function TooltipTranslation() {
  console.log("TooltipTranslation component rendered");

  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Store user settings from the message
  const [voiceMode, setVoiceMode] = useState<boolean>(true);
  const [dictionaryMode, setDictionaryMode] = useState<boolean>(true);
  const [lightMode, setLightMode] = useState<boolean>(true);

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  //TODO: Maybe move this logic to a custom hook
  useEffect(() => {
    const messageListener = async (message: TranslationMessage) => {
      //Message 1
      if (message.action === "SHOW_TRANSLATION") {
        // Update settings from the message (sent by service worker)
        setVoiceMode(message.voiceMode);
        setDictionaryMode(message.dictionaryMode);
        setLightMode(message.lightMode);

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
        setText("");

        try {
          // Use targetLang from message (which comes from user settings via service worker)
          const targetLanguage = message.targetLang;

          //Check if the user has the necessary capabilities to translate the text
          const translatorCapabilities = await Translator.availability({
            sourceLanguage: "en",
            targetLanguage: targetLanguage,
          });

          if (translatorCapabilities === "unavailable") {
            console.warn("Translation capabilities unavailable");
            setText("Translation unavailable for this language");
            setIsLoading(false);
            return;
          }

          // Create translator (this might take time if model needs to be downloaded)
          const translator = await Translator.create({
            sourceLanguage: "en",
            targetLanguage: targetLanguage,
          });

          // Translate the text
          const translatedText = await translator.translate(message.text);
          console.log("Translated text:", translatedText);
          setText(translatedText);
        } catch (error) {
          console.error("Translation error:", error);
          setText("Translation failed. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
      return true; // Keep the message listener alive
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup: remove listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  //If no translation is requested, return no UI
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="absolute z-999999 min-w-[220px] max-w-[380px] animate-in fade-in slide-in-from-bottom-2 duration-200"
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
                {/* Voice mode icon */}
                {voiceMode && (
                  <div className="rounded px-1 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Volume2 className="size-3.5" />
                  </div>
                )}

                {/* Dictionary mode icon */}
                {dictionaryMode && (
                  <div className="rounded px-1 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <BookOpen className="size-3.5" />
                  </div>
                )}

                {/* Light/Dark mode icon */}
                <div className="rounded px-1 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  {lightMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                </div>
              </div>

              {/* Close button */}
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  setIsVisible(false);
                  setText("");
                  setIsLoading(false);
                }}
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
              <p className="text-sm text-muted-foreground">Translating...</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}
