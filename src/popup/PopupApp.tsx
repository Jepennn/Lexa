import { ArrowRightLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserSettings } from "@/hooks/useGetUserSettings";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { NoAccessToAi } from "@/popup/NoAccessToAi";
import { OnboardingRedirect } from "@/popup/OnboardingRedirect";
import { Spinner } from "@/components/ui/spinner";

// Map language codes to names (simplified)
const LANG_MAP: Record<string, string> = {
  sv: "Swedish",
  en: "English",
  fr: "French",
  es: "Spanish",
  ja: "Japanese",
};

function PopupApp() {
  const [hasAccessAI] = useState("Translator" in window);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const userSettings = useGetUserSettings();

  // Check if the user has seen the onboarding
  useEffect(() => {
    chrome.storage.sync.get(["hasSeenOnboarding"], (result) => {
      setShowOnboarding(result.hasSeenOnboarding !== true);
    });
  }, []);

  // Show a loading state while checking storage to prevent flicker
  if (showOnboarding === null) {
    return (
      <div className="flex items-center justify-center h-[220px] w-full bg-background">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  // If the user does not have access to the AI, show the no access to ai componen
  if (!hasAccessAI) {
    return <NoAccessToAi />;
  }

  const openSidePanel = async () => {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id) {
      // Send message to background with the specific tab ID
      chrome.runtime.sendMessage({
        action: "OPEN_SIDE_PANEL",
        tabId: tab.id,
      });
      // Close the popup
      window.close();
    }
  };

  if (showOnboarding) {
    return <OnboardingRedirect onOpenSidePanel={openSidePanel} />;
  }

  const handleSwapLanguages = () => {
    if (!userSettings) return;
    chrome.storage.sync.set({
      sourceLang: userSettings.targetLang,
      targetLang: userSettings.sourceLang,
    });
  };

  // Safe access to language names
  const sourceName = userSettings
    ? LANG_MAP[userSettings.sourceLang] || userSettings.sourceLang.toUpperCase()
    : "...";
  const targetName = userSettings
    ? LANG_MAP[userSettings.targetLang] || userSettings.targetLang.toUpperCase()
    : "...";

  return (
    <div className="flex flex-col h-full w-full bg-background p-3 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-[10px]">L</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Actions Card */}
      <Card className="p-3 flex flex-col gap-2 shadow-sm border-border/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-col items-center justify-center p-1.5 rounded-lg bg-secondary/30">
            <span className="text-[10px] text-muted-foreground font-medium mb-0.5">From</span>
            <span className="font-semibold text-xs">{sourceName}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full shrink-0 hover:bg-muted text-muted-foreground"
            onClick={handleSwapLanguages}
          >
            <ArrowRightLeft className="size-3.5" />
          </Button>

          <div className="flex-1 flex flex-col items-center justify-center p-1.5 rounded-lg bg-secondary/30">
            <span className="text-[10px] text-muted-foreground font-medium mb-0.5">To</span>
            <span className="font-semibold text-xs">{targetName}</span>
          </div>
        </div>
      </Card>

      {/* Primary Action */}
      <Button variant="secondary" className="w-full shadow-sm gap-2" onClick={openSidePanel}>
        <Settings className="size-4" />
        Manage extension
      </Button>

      {/* Footer Info */}
      <p className="text-center text-[10px] text-muted-foreground/60">
        Select text on any page to translate instantly.
      </p>
    </div>
  );
}

export default PopupApp;
