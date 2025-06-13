import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/bKKClogo.svg';
import {motion} from 'framer-motion'

const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/students', label: 'Студенты' },
    { path: '/users', label: 'Преподаватели' },
]

const Navbar = () => {
    const location = useLocation()
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
        >
        <nav className="bg-white px-10 rounded-b-xl">
            <div className="container max-h-30 px-10 py-3 flex justify-between items-center">
                <Link to="/">
                <img src={logo} alt="bKKC logo" className="h-10 my-4 " />
                </Link>
                <ul className="flex gap-6">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`transition-all duration-300 hover:underline ${
                                    location.pathname === item.path ? 'underline' : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
        </motion.div>
    )
}

export default Navbar
