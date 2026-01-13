import { useEffect, useState } from "react";

type UserSettings = {
  targetLang: string;
  sourceLang: string;
  voiceMode: boolean;
  dictionaryMode: boolean;
  lightMode: boolean;
  hasSeenOnboarding: boolean;
};

export function useGetUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    // initial load
    chrome.storage.sync.get(null, (result) => {
      setSettings({
        targetLang: typeof result.targetLang === "string" ? result.targetLang : "sv",
        sourceLang: typeof result.sourceLang === "string" ? result.sourceLang : "en",
        voiceMode: typeof result.voiceMode === "boolean" ? result.voiceMode : true,
        dictionaryMode: typeof result.dictionaryMode === "boolean" ? result.dictionaryMode : true,
        lightMode: typeof result.lightMode === "boolean" ? result.lightMode : true,
        hasSeenOnboarding: typeof result.hasSeenOnboarding === "boolean" ? result.hasSeenOnboarding : false,
      });
    });

    // listen for changes
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: chrome.storage.AreaName
    ) => {
      if (area !== "sync") return;

      setSettings((prev) => ({
        ...prev!,
        ...Object.fromEntries(
          Object.entries(changes).map(([key, { newValue }]) => [key, newValue])
        ),
      }));
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return settings;
}
