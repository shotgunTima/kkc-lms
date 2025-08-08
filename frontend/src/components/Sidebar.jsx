import helloIcon from '../assets/helloIcon.svg'
import { motion } from 'framer-motion'
import {useTranslation} from "react-i18next";

const menuItems = [
    { key: 'users' },
    { key: 'students' },
    { key: 'groups' },
    { key: 'teachers' },
    { key: 'directions' },
    { key: 'methodists' },
    { key: 'accountants' },
];


const Sidebar = ({ selectedKey, onSelect }) => {
    const {t} = useTranslation();
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
                    <span>Шарли ду Бронкс</span>
                </div>
            </div>

            <div className="bg-white rounded-tl-none rounded-lg px-10 py-4 w-64
            dark:bg-gray-800 hover:shadow-white-around dark:hover:shadow-blue-around ">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.key}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(item.key)}
                                className={`block font-semibold text-left  dark:text-white dark:text-opacity-80
                                dark:hover:text-bgPrimary w-full text-l ${
                                    selectedKey === item.key 
                                        ? 'text-bgSecondary '
                                        : 'text-textPrimary hover:text-bgSecondary'
                                }`}
                            >
                                {t(item.key)}
                            </motion.button>

                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}

export default Sidebar
