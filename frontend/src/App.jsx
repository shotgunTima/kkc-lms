import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Users from './pages/Users'
import Navbar from './components/Navbar'
import Directions from "./pages/Directions.jsx";
import Subjects from "./pages/Subjects.jsx";

function App() {
    return (
        <Router>

                <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/directions" element={<Directions />} />
                        <Route path="/subjects" element={<Subjects />} />
                    </Routes>


        </Router>
    )
}

export default App
