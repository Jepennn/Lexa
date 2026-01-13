import { useState, useEffect } from "react";
import { SidePanelMenu } from "./SidePanelMenu";
import { Dictionary } from "./Dictionary";
import { Onboarding } from "./Onboarding";
import { ProfileSettings } from "@/popup/ProfileSettings";
import { NoAccessToAi } from "@/popup/NoAccessToAi";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useGetUserSettings } from "@/hooks/useGetUserSettings";
import type { AppViews } from "@/types";

export function SidePanelApp() {
  const [currentView, setCurrentView] = useState<AppViews | "menu">("menu");
  const [hasAccessAI] = useState("Translator" in window);
  const userSettings = useGetUserSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (userSettings && userSettings.hasSeenOnboarding === false) {
      setShowOnboarding(true);
    }
  }, [userSettings]);

  const handleOnboardingComplete = () => {
    chrome.storage.sync.set({ hasSeenOnboarding: true });
    setShowOnboarding(false);
  };

  if (!hasAccessAI) {
    return <NoAccessToAi />;
  }
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render the Menu View
  if (currentView === "menu") {
    return <SidePanelMenu onNavigate={(view) => setCurrentView(view)} />;
  }

  // Render other views with a Back Button layout
  return (
    <div className="flex h-screen w-full flex-col bg-background dark text-foreground">
      {/* Header for Pages */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-card shadow-xs z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-muted text-foreground hover:bg-muted/80 shadow-sm"
          onClick={() => setCurrentView("menu")}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold text-foreground">
          {currentView === "settings" && "Settings"}
          {currentView === "dictionary" && "Dictionary"}
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        {currentView === "settings" && <ProfileSettings />}
        {currentView === "dictionary" && <Dictionary />}
      </div>
    </div>
  );
}
