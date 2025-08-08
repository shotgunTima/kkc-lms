import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(i18n.language || "en");

    const languages = {
        ru: { label: "Русский", flag: "🇷🇺" },
        ky: { label: "Кыргызча", flag: "🇰🇬" },
        en: { label: "English", flag: "🇺🇸" },
        ko: { label: "한국어", flag: "🇰🇷" },
    };

    const toggleOpen = () => setOpen((prev) => !prev);

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        setCurrent(code);
        setOpen(false);
    };

    useEffect(() => {
        setCurrent(i18n.language);
    }, [i18n.language]);

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="w-full flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600
                    text-sm text-gray-800 dark:text-gray-200 font-medium rounded-xl transition shadow-sm hover:shadow-md"
            >
                <span className="flex items-center gap-8 text-textPrimary dark:text-gray-200">
                    <Languages className="w-6 h-6" />
                    {languages[current]?.flag || "🌐"} {languages[current]?.label || current}
                </span>
                <span className="text-xs text-textPrimary dark:text-gray-200">▼</span>
            </button>

            {open && (
                <ul className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
                    {Object.entries(languages).map(([code, { label, flag }]) => (
                        <li key={code}>
                            <button
                                onClick={() => handleSelect(code)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2
                                    hover:bg-blue-50 dark:hover:bg-gray-600
                                    ${current === code ? "font-semibold text-bgSecondary" : "text-gray-700 dark:text-gray-200"}`}
                            >
                                {flag} {label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSwitcher;
