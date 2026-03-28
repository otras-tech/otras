import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="text-sm font-semibold border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 outline-none focus:border-blue-400 cursor-pointer transition-colors hover:border-blue-300"
      style={{ minWidth: 110 }}
    >
      {LANGUAGES.map(({ code, label, flag }) => (
        <option key={code} value={code}>
          {flag} {label}
        </option>
      ))}
    </select>
  );
}