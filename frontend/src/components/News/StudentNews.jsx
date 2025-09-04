import { useEffect, useState } from "react";
import api from "../../api/axios.js";
// правильно — из News → components → src/api.js

export default function StudentNews() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        api.get("/news/student")
            .then((res) => setNews(res.data))
            .catch((err) => console.error("Ошибка при загрузке новостей:", err));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Новости для студента</h2>
            <ul className="space-y-3">
                {news.map((item) => (
                    <li key={item.id} className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p>{item.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
