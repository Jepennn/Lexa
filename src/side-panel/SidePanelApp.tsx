import { useState } from "react";
import { SidePanelMenu } from "./SidePanelMenu";
import { Dictionary } from "./Dictionary";
import { Practice } from "./Practice";
import { Onboarding } from "./Onboarding";
import { ProfileSettings } from "@/popup/ProfileSettings";
import { NoAccessToAi } from "@/popup/NoAccessToAi";
import { useGetUserSettings } from "@/hooks/useGetUserSettings";
import type { sidepanelViews } from "@/types";
import { SidePanelLayout } from "./SidePanelLayout";

export function SidePanelApp() {
  const [currentView, setCurrentView] = useState<sidepanelViews>("menu");
  const [hasAccessAI] = useState("Translator" in window);
  const userSettings = useGetUserSettings();
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const shouldShowOnboarding = userSettings?.hasSeenOnboarding === false && !onboardingDismissed;

  const handleOnboardingComplete = () => {
    chrome.storage.sync.set({ hasSeenOnboarding: true });
    setOnboardingDismissed(true);
  };

  if (!hasAccessAI) {
    return <NoAccessToAi />;
  }
  if (shouldShowOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentView === "menu") {
    return <SidePanelMenu onNavigate={(view) => setCurrentView(view)} />;
  }

  switch (currentView) {
    case "settings":
      return (
        <SidePanelLayout title="Settings" onBack={() => setCurrentView("menu")}>
          <ProfileSettings />
        </SidePanelLayout>
      );
    case "dictionary":
      return (
        <SidePanelLayout title="Dictionary" onBack={() => setCurrentView("menu")}>
          <Dictionary />
        </SidePanelLayout>
      );
    case "practice":
      return (
        <SidePanelLayout title="Practice" onBack={() => setCurrentView("menu")}>
          <Practice onOpenDictionary={() => setCurrentView("dictionary")} />
        </SidePanelLayout>
      );
    default:
      return <SidePanelMenu onNavigate={(view) => setCurrentView(view)} />;
  }
}
