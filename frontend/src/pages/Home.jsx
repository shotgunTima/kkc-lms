import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Students from './Students'
import Users from "./Users.jsx";
import Groups from "./Groups.jsx";
import Directions from "./Directions.jsx";
import {useTranslation} from "react-i18next";
import Teachers from "./Teachers.jsx";

const Home = () => {
    const [selectedSection, setSelectedSection] = useState(null)
    const {t} = useTranslation();
    const renderContent = () => {
        const sectionKey = selectedSection || 'default'

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={sectionKey}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    {(() => {
                        switch (selectedSection) {
                            case 'users':
                                return (
                                    <>
                                        <Users/>
                                    </>
                                )
                            case 'students':
                                return (
                                    <>
                                        <Students />
                                    </>
                                )
                            case 'groups':
                                return (
                                    <>
                                        <Groups />
                                    </>
                                )
                            case 'teachers':
                                return <Teachers/>
                            case 'directions':
                                return (
                                    <Directions />
                                )
                            case 'accountants':
                                return <p className="text-lg text-gray-500 dark:text-gray-400">Бухгалтеры (пока заглушка)</p>
                            default:
                                return <p className="text-lg text-gray-500 dark:text-gray-400">{t("select_section")}</p>
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <div className="min-h-screen flex items-start mx-10 my-5 p-6 gap-10 " >
            <Sidebar selectedKey={selectedSection} onSelect={setSelectedSection} />
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="bg-white bg-opacity-100 rounded-xl p-5 w-full hover:shadow-white-around
                 dark:bg-gray-800 dark:bg-opacity-90 dark:hover:shadow-blue-around"

            >

            {renderContent()}
            </motion.div>
        </div>
    )
}

export default Home
