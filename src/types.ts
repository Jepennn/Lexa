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
export type AppViews = "introduction" | "settings" | "dictionary";
