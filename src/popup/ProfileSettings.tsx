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
    <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
      <div className="space-y-4 px-4 py-4">
        {/* Language Selection */}
        <div className="flex flex-col gap-3.5">
          <div>
            <Label htmlFor="language" className="text-xs font-semibold text-foreground">
              Translation Language
            </Label>
            <p className="text-[10px] text-muted-foreground">
              Choose which language to translate text into
            </p>
            <NativeSelect
              size="sm"
              className="w-full text-white"
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
            <Label htmlFor="sourceLanguage" className="text-xs font-semibold text-foreground">
              Source Language
            </Label>
            <p className="text-[10px] text-muted-foreground">
              Choose which language to translate text from
            </p>
            <NativeSelect
              size="sm"
              className="w-full text-white"
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
            <Label htmlFor="displayOptions" className="text-xs font-semibold text-foreground">
              Translation toolbar options
            </Label>
          </div>

          {/* Switches - Mapped from array */}
          {SWITCH_OPTIONS.map((switchOption) => (
            <div
              key={switchOption.id}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <div className="flex-1">
                <Label
                  htmlFor={switchOption.id}
                  className="text-xs font-medium text-foreground cursor-pointer"
                >
                  {switchOption.label}
                </Label>
                <p className="text-[10px] text-muted-foreground">{switchOption.description}</p>
              </div>
              <Switch
                id={switchOption.id}
                checked={userSettings[switchOption.id]}
                onCheckedChange={() => toggleSwitch(switchOption.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

