import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

//Importing custom types
import type { TranslationMessage } from "./types";

export function TooltipTranslation() {
  const [text, setText] = useState<string>("");
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  console.log("TranslationOverlay component rendered");

  //TODO:
  /**
   * 1. Implement so we can send a text from service worker to content script to show the translation overlay
   * 2. Implement a communication between the content script and the service worker to check if the user can use the request language combination
   */

  //TODO: Maybe move this logic to a custom hook
  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message: TranslationMessage) => {
      //Message 1
      if (message.action === "SHOW_TRANSLATION") {
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

        //TODO: Maybe fetch the users preferred language if possible and use that instead of hardcoded "en" and "sv"
        const translatorCapabilities = await Translator.availability({
          sourceLanguage: "en",
          targetLanguage: "sv",
        });

        if (translatorCapabilities === "unavailable") {
          console.warn("Translation capabilities unavailable");
          // TODO: Show error message to user
        }

        //TODO: Implement so a loading state is shown if the model needs to be created
        const translator = await Translator.create({
          sourceLanguage: "en",
          targetLanguage: "sv",
        });

        const translatedText = await translator.translate(message.text);
        console.log("Translated text:", translatedText);
        setText(translatedText);
        setIsVisible(true);
      }
      return true; // Keep the message listener alive
    });
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
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false);
                setText("");
              }}
              className="size-6 text-muted-foreground hover:text-foreground"
              aria-label="Close translation"
            >
              <X className="size-3.5" />
            </Button>
          </div>

          {/* Translation text */}
          <p className="text-sm leading-relaxed text-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
