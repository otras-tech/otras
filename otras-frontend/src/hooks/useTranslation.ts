import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import te from "../i18n/te.json";

type Dictionary = Record<string, string>;
const dictionaries: Record<string, Dictionary> = { en: en as Dictionary, hi: hi as Dictionary, te: te as Dictionary };

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  const { language, setLanguage } = context;

  const t = (key: string, options: Record<string, any> = {}) => {
    let text = dictionaries[language]?.[key] || dictionaries.en?.[key] || key;
    
    // Support interpolation: {{count}}
    if (options && typeof options === 'object') {
      Object.keys(options).forEach(prop => {
        text = text.replace(new RegExp(`{{${prop}}}`, 'g'), String(options[prop]));
      });
    }
    
    return text;
  };

  return { t, language, setLanguage };
}

// Keep backward compatible named export
export function translate(language: string, key: string, options: Record<string, any> = {}) {
  let text = dictionaries[language]?.[key] || dictionaries.en?.[key] || key;

  if (options && typeof options === 'object') {
    Object.keys(options).forEach(prop => {
      text = text.replace(new RegExp(`{{${prop}}}`, 'g'), String(options[prop]));
    });
  }

  return text;
}