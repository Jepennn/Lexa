export type TranslationMessage = {
  action: string;
  text: string;
  length: number;
  sourceLang: string;
  targetLang: string;
  voiceMode: boolean;
  dictionaryMode: boolean;
  lightMode: boolean;
};

export type TranslationShortcutMessage = {
  action: string;
};

export type UserSettings = {
  targetLang: string;
  sourceLang: string;
  voiceMode: boolean;
  dictionaryMode: boolean;
  lightMode: boolean;
};

//Intro steps for the app
export type IntroductionStep = {
  title: string;
  description: string;
  badge: string;
};

//Views for the app
export type sidepanelViews = "menu" | "settings" | "dictionary";

export type DictionaryIcon =
  | "book"
  | "globe"
  | "star"
  | "graduation"
  | "zap"
  | "heart"
  | "flag"
  | "bookmark";
export type DictionaryColor =
  | "bg-brand-orange"
  | "bg-brand-blue"
  | "bg-brand-pink"
  | "bg-brand-purple"
  | "bg-brand-green"
  | "bg-brand-yellow";

export interface Dictionary {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  icon: DictionaryIcon;
  color: DictionaryColor;
}

export interface DictionaryEntry {
  id: string;
  dictionaryId: string;
  text: string;
  translation: string;
  createdAt: number;
}

export type DictionariesStorage = Record<string, Dictionary>;
