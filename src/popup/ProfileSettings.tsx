import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useGetUserSettings } from "@/hooks/useGetUserSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Language = "sv" | "fr" | "es" | "ja" | "en" | "";

type SwitchOption = {
  id: "voiceMode" | "dictionaryMode" | "lightMode";
  label: string;
  description: string;
};

const SWITCH_OPTIONS: SwitchOption[] = [
  {
    id: "voiceMode",
    label: "Voice mode",
    description: "Get the translation spoken out loud",
  },
  {
    id: "dictionaryMode",
    label: "Dictionary mode",
    description: "Save the translation to your dictionary",
  },
  {
    id: "lightMode",
    label: "Light mode",
    description: "Use a light theme for the translation",
  },
];

export function ProfileSettings() {
  const userSettings = useGetUserSettings();

  if (!userSettings || !userSettings.targetLang) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Settings Not Found</AlertTitle>
        <AlertDescription>
          Unable to load user settings. Please try reloading the extension.
        </AlertDescription>
      </Alert>
    );
  }
  // Toggle switch in Chrome storage
  const toggleSwitch = (id: "voiceMode" | "dictionaryMode" | "lightMode") => {
    const newValue = !userSettings[id];
    chrome.storage.sync.set({ [id]: newValue });
  };

  // Update language in Chrome storage
  const handleTargetLanguageChange = (language: Language) => {
    chrome.storage.sync.set({ targetLang: language });
  };

  const handleSourceLanguageChange = (language: Language) => {
    chrome.storage.sync.set({ sourceLang: language });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header Section - Matching Dictionary style */}
      <div className="flex items-center justify-between px-1 py-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-xs text-muted-foreground font-medium">Manage your preferences</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
        <div className="space-y-4 px-4 py-4">
          {/* Language Selection */}
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="language" className="text-sm font-semibold text-foreground">
                Translation Language
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose which language to translate text into
              </p>
              <NativeSelect
                size="sm"
                className="w-full mt-2 text-foreground"
                id="language"
                value={userSettings.targetLang}
                onChange={(e) => handleTargetLanguageChange(e.target.value as Language)}
              >
                <NativeSelectOption value="">Not selected</NativeSelectOption>
                <NativeSelectOption value="sv">Swedish</NativeSelectOption>
                <NativeSelectOption value="fr">French</NativeSelectOption>
                <NativeSelectOption value="es">Spanish</NativeSelectOption>
                <NativeSelectOption value="ja">Japanese</NativeSelectOption>
                <NativeSelectOption value="en">English</NativeSelectOption>
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="sourceLanguage" className="text-sm font-semibold text-foreground">
                Source Language
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose which language to translate text from
              </p>
              <NativeSelect
                size="sm"
                className="w-full mt-2 text-foreground"
                id="sourceLanguage"
                value={userSettings.sourceLang}
                onChange={(e) => handleSourceLanguageChange(e.target.value as Language)}
              >
                <NativeSelectOption value="">Not selected</NativeSelectOption>
                <NativeSelectOption value="sv">Swedish</NativeSelectOption>
                <NativeSelectOption value="fr">French</NativeSelectOption>
                <NativeSelectOption value="es">Spanish</NativeSelectOption>
                <NativeSelectOption value="ja">Japanese</NativeSelectOption>
                <NativeSelectOption value="en">English</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Translation Display Options */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="displayOptions" className="text-sm font-semibold text-foreground">
                Translation toolbar options
              </Label>
            </div>

            {/* Switches - Mapped from array */}
            {SWITCH_OPTIONS.map((switchOption) => (
              <div
                key={switchOption.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-3"
              >
                <div className="flex-1 pr-4">
                  <Label
                    htmlFor={switchOption.id}
                    className="text-sm font-medium text-foreground cursor-pointer block"
                  >
                    {switchOption.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{switchOption.description}</p>
                </div>
                <Switch
                  id={switchOption.id}
                  className="data-[state=checked]:bg-emerald-500"
                  checked={userSettings[switchOption.id]}
                  onCheckedChange={() => toggleSwitch(switchOption.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}