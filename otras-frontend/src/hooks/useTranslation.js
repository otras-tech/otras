import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import te from "../i18n/te.json";

const dictionaries = { en, hi, te };

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (key, options = {}) => {
    let text = dictionaries[language]?.[key] || dictionaries.en?.[key] || key;
    
    // Support interpolation: {{count}}
    if (options && typeof options === 'object') {
      Object.keys(options).forEach(prop => {
        text = text.replace(new RegExp(`{{${prop}}}`, 'g'), options[prop]);
      });
    }
    
    return text;
  };

  return { t, language, setLanguage };
}

// Keep backward compatible named export
export function translate(language, key, options = {}) {
  let text = dictionaries[language]?.[key] || dictionaries.en?.[key] || key;

  if (options && typeof options === 'object') {
    Object.keys(options).forEach(prop => {
      text = text.replace(new RegExp(`{{${prop}}}`, 'g'), options[prop]);
    });
  }

  return text;
}