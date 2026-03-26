import { createContext, useState, useEffect } from "react"
import axios from "axios"
export const LanguageContext = createContext(null)
export function LanguageProvider({ children }) {
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