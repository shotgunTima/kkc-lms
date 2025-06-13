import helloIcon from '../assets/helloIcon.svg'
import { motion } from 'framer-motion'

const menuItems = [
    { label: 'Пользователи', key: 'users' },
    { label: 'Студенты', key: 'students' },
    { label: 'Группы', key: 'groups' },
    { label: 'Преподаватели', key: 'teachers' },
    { label: 'Кафедры', key: 'departments' },
    { label: 'Методист(-ы)', key: 'methodists' },
    { label: 'Баптисты', key: '' },
    { label: 'Бухгалтер(-ы)', key: 'accountants' },
]

const Sidebar = ({ selectedKey, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: -30 }}
            transition={{ duration: 0.3 }}
            >
            <div className="flex items-center gap-4">
                <img src={helloIcon} alt="icon" className="-mx-3 w-12 h-12 " />
                <div className="flex flex-col leading-tight text-white font-semibold text-xl">
                    <span>привет,</span>
                    <span>Каримов Тимурлан</span>
                </div>
            </div>


            <div className="bg-white rounded-tl-none rounded-2xl px-10 py-4 w-64">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.key}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(item.key)}
                                className={`block font-semibold text-left w-full text-l ${
                                    selectedKey === item.key
                                        ? 'text-textSecondary'
                                        : 'text-textPrimary hover:text-blue-700'
                                }`}
                            >
                                {item.label}
                            </motion.button>

                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}

export default Sidebar
