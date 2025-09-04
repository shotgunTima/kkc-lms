import { Link} from 'react-router-dom'
import logo from '../assets/bKKClogo.svg';
import {motion} from 'framer-motion'
import SettingsMenu from "./SettingsMenu.jsx";
import { useAuth } from "../auth/AuthPack.jsx";

const Navbar = () => {

    const {logout } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
        >
        <nav className="bg-gray-50 px-10 rounded-b-md dark:bg-gray-800
        hover:shadow-white-around dark:hover:shadow-blue-around">
            <div className="container max-h-30 px-4 py-3 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="bKKC logo" className="h-10 my-5 cursor-pointer
                    transition-transform duration-300 transform hover:scale-110 hover:-translate-y-1" />

                </Link>


                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <SettingsMenu />
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                        Выйти
                    </button>
                </div>
            </div>


        </nav>
        </motion.div>
    )
}

export default Navbar
