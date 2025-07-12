import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/bKKClogo.svg';
import {motion} from 'framer-motion'


const Navbar = () => {

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
        >
        <nav className="bg-white px-10 rounded-b-md">
            <div className="container max-h-30 px-4 py-3 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="bKKC logo" className="h-10 my-5 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:-translate-y-1" />

                </Link>

            </div>
        </nav>
        </motion.div>
    )
}

export default Navbar
