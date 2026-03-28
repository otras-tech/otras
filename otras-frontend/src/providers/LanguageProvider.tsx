import { createContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState("en")

    useEffect(() => {
        axios.defaults.headers.common["x-language"] = language
    }, [language])

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}