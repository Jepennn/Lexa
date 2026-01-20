import { useEffect, useState } from "react";

type UserSettings = {
  targetLang: string;
  sourceLang: string;
  voiceMode: boolean;
  dictionaryMode: boolean;
  hasSeenOnboarding: boolean;
};

//For handling 
const DEFAULT_SETTINGS: UserSettings = {
  targetLang: "sv",
  sourceLang: "en",
  voiceMode: true,
  dictionaryMode: true,
  hasSeenOnboarding: false,
};

export function useGetUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // initial load
    chrome.storage.sync.get(null, (result) => {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...result,
      });
    });

    // listen for changes
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: chrome.storage.AreaName
    ) => {
      if (area !== "sync") return;

      setSettings((prev) => ({
        ...prev,
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
