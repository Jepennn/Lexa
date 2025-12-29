export type TranslationMessage = {
  action: string;
  text: string;
  length: number;
};

//Intro steps for the app
export type IntroductionStep = {
  title: string;
  description: string;
  badge: string;
};

//Views for the app
export type AppViews = "introduction" | "settings" | "dictionary";
