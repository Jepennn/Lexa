import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = "swedish" | "french" | "spanish" | "japanese";

type SwitchOption = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

//TODO:
/**
 * 1. Add a way to store the users setting in the chrome storage.
 * 2. Add a way to load the settings from the chrome storage
 *
 */

export function ProfileSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("swedish");
  const [switches, setSwitches] = useState<SwitchOption[]>([
    {
      id: "button1",
      label: "Button 1",
      description: "Enable button 1 functionality",
      enabled: false,
    },
    {
      id: "button2",
      label: "Button 2",
      description: "Enable button 2 functionality",
      enabled: false,
    },
    {
      id: "button3",
      label: "Button 3",
      description: "Enable button 3 functionality",
      enabled: false,
    },
  ]);

  const toggleSwitch = (id: string) => {
    setSwitches((prev) => prev.map((sw) => (sw.id === id ? { ...sw, enabled: !sw.enabled } : sw)));
  };

  return (
    <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
      <div className="space-y-4 px-4 py-4">
        {/* Language Selection */}
        <div className="space-y-2">
          <Label htmlFor="language" className="text-xs font-medium text-foreground">
            Translation Language
          </Label>
          <Select
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as Language)}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="swedish">Swedish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Choose which language to translate text into
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Translation Display Options */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-medium text-foreground">Display Options</h3>
            <p className="text-[10px] text-muted-foreground">
              Customize what appears in translations
            </p>
          </div>

          {/* Switches - Mapped from array */}
          {switches.map((switchOption) => (
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
                checked={switchOption.enabled}
                onCheckedChange={() => toggleSwitch(switchOption.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
