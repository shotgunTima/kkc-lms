import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Users from './pages/Users';
import Navbar from './components/Navbar';
import Directions from "./pages/Directions.jsx";
import Subjects from "./pages/Subjects.jsx";
import Schedule from "./pages/Schedule.jsx";
import News from "./pages/News.jsx";
import StudentNews from "./components/News/StudentNews.jsx";


import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider> {/* оборачиваем всё приложение */}
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/directions" element={<Directions />} />
                        <Route path="/subjects" element={<Subjects />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/student/news" element={<StudentNews />} />
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
