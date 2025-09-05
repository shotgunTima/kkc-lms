import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function StudentNews() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        api.get("/news/student")
            .then((res) => setNews(res.data))
            .catch((err) => console.error("Ошибка при загрузке новостей:", err));
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Новости для студента</h2>

            {news.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Новостей пока нет</p>
            ) : (
                <ul className="space-y-4">
                    {news.map((item) => (
                        <li
                            key={item.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">{item.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
