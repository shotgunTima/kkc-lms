import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Settings,SunMoon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../i18n/locales/LanguageSwitcher.jsx";


const SettingsMenu = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [open, setOpen] = useState(false);

    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="p-2 rounded-full transition hover:rotate-90 bg-bgSecondary
                dark:bg-gray-900 dark:hover:bg-gray-700  shadow-black-around"
                title="Настройки"
            >
                <Settings className="w-7 h-7 text-white dark:text-gray-200 transition" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-6 mt-2 w-64 bg-bgPrimary/60  dark:bg-gray-800/60
                        shadow-black-around rounded-tr-none rounded-2xl p-4 z-50 backdrop-blur-sm"
                    >
                        <p className="text-sm font-semibold text-white dark:text-gray-200 mb-3 uppercase tracking-wide ">
                            {t("settings")}
                        </p>

                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-8 p-3 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-sm text-textPrimary dark:text-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <SunMoon className="w-6 h-6 text-indigo-800 dark:text-yellow-400 on-tap:rotate-90 transition-transform duration-300" />
                                    <span className="">
          {theme === "light" ? t("dark_mode") : t("light_mode")}
        </span>
                                </button>
                            </li>

                            <li>
                                <LanguageSwitcher />
                            </li>


                            <li>
                                <button
                                    disabled
                                    className="w-full flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 text-sm text-gray-400 font-medium rounded-xl cursor-not-allowed"
                                >
                                    👤 (в разработке)
                                </button>
                            </li>
                        </ul>
                    </motion.div>

                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsMenu;
