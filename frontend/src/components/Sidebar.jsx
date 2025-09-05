// -----------------------------
// Sidebar.jsx (restored + renamed 'news' -> 'Новостная лента')
// -----------------------------
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import helloIcon from "../assets/helloIcon.svg";
import { useAuth } from "../context/AuthContext"; // обязательно

const Sidebar = ({ selectedKey, onSelect }) => {
    const { t } = useTranslation();
    const { user } = useAuth() || {};
    console.log("USER:", user);


    // защитные флаги — если user ещё не загружен, считаем, что не авторизован
    const isStudent = user && (user.role === "STUDENT" || user.role === "ROLE_STUDENT");
    const isAdmin = user && (user.role === "ADMIN" || user.role === "ROLE_ADMIN");

    const menuItems = [
        { key: "users" },
        { key: "students" },
        { key: "groups" },
        { key: "teachers" },
        { key: "directions" },
        { key: "subjects" },
        { key: "offerings" },
        { key: "semesters" },
        { key: "schedule" },
        { key: "news" }
        // не добавляем тут news — рендерим условно ниже
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: -30 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-4">
                <img src={helloIcon} alt="icon" className="-mx-3 w-12 h-12 dark:opacity-80 " />
                <div className="flex flex-col leading-tight text-white dark:text-opacity-70 font-semibold text-xl">
                    <span>{t("hello")},</span>
                    <span>{user?.username || "Гость"}</span>
                </div>
            </div>

            <div className="bg-white rounded-tl-none rounded-lg px-10 py-4 w-64 dark:bg-gray-800 hover:shadow-white-around dark:hover:shadow-blue-around ">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.key}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(item.key)}
                                className={`block font-semibold text-left w-full text-l ${
                                    selectedKey === item.key ? "text-bgSecondary" : "text-textPrimary hover:text-bgSecondary"
                                } dark:text-white dark:text-opacity-80`}
                            >
                                {item.key === 'news' ? "Новостная лента" : t(item.key)}
                            </motion.button>
                        </li>
                    ))}

                    {/* Админ видит пункт для управления новостями */}
                    {isAdmin && (
                        <li>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect("news")}
                                className={`block font-semibold text-left w-full text-l ${
                                    selectedKey === "news" ? "text-bgSecondary" : "text-textPrimary hover:text-bgSecondary"
                                } dark:text-white dark:text-opacity-80`}
                            >
                                {"Новостная лента"}
                            </motion.button>
                        </li>
                    )}

                    {/* Студент видит свои новости */}
                    {isStudent && (
                        <li>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect("student_news")}
                                className={`block font-semibold text-left w-full text-l ${
                                    selectedKey === "student_news" ? "text-bgSecondary" : "text-textPrimary hover:text-bgSecondary"
                                } dark:text-white dark:text-opacity-80`}
                            >
                                {t("student_news")}
                            </motion.button>
                        </li>
                    )}
                </ul>
            </div>
        </motion.div>
    );
};

export default Sidebar;


// -----------------------------
// NewsPage.jsx (restored original)
// -----------------------------


// -----------------------------
// News.jsx (restored + added Telegram button)
// -----------------------------
