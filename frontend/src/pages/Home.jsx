import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Students from './Students'
import Users from "./Users.jsx"; // подключаем компонент со всем функционалом

const Home = () => {
    const [selectedSection, setSelectedSection] = useState(null)

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
                            case 'teachers':
                                return <p className="text-lg text-gray-700">Список преподавателей (пока заглушка)</p>
                            case 'methodists':
                                return <p className="text-lg text-gray-700">Методисты (пока заглушка)</p>
                            case 'accountants':
                                return <p className="text-lg text-gray-700">Бухгалтеры (пока заглушка)</p>
                            default:
                                return <p className="text-lg text-gray-500">Выберите раздел</p>
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <div className="min-h-screen flex items-start mx-10 my-5 p-6 gap-10">
            <Sidebar selectedKey={selectedSection} onSelect={setSelectedSection} />
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-xl rounded-2xl p-5 w-full"
            >

            {renderContent()}
            </motion.div>
        </div>
    )
}

export default Home
