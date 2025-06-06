export type Language = "en";
export type Theme = string;

export interface MongoloreConfig {
  preferredLanguage: Language;
  preferredDarkTheme: Theme;
  preferredLightTheme: Theme;
  preferredFont: string;
  preferredFontSize: number;
  preferredLineHeight: number;
  preferredLetterSpacing: number;
  preferredWordSpacing: number;
}
