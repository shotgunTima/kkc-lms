import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const TARGETS = [
    { value: "ALL", label: "Всем студентам" },
    { value: "DIRECTION", label: "Для направления" },
    { value: "GROUP", label: "Для группы" },
];

export default function NewsForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [targetType, setTargetType] = useState("ALL");

    const [directions, setDirections] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedDirection, setSelectedDirection] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    useEffect(() => {
        api
            .get("/directions")
            .then((res) => setDirections(res.data || []))
            .catch(() => setDirections([]));
    }, []);

    useEffect(() => {
        if (!selectedDirection) {
            setGroups([]);
            setSelectedGroup("");
            return;
        }
        api
            .get(`/directions/${selectedDirection}/groups`)
            .then((res) => setGroups(res.data || []))
            .catch(() => setGroups([]));
    }, [selectedDirection]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return alert("Заполните все поля!");

        try {
            const payload = { title: title.trim(), content: content.trim(), targetType };
            if (targetType === "DIRECTION") payload.directionId = Number(selectedDirection);
            if (targetType === "GROUP") {
                payload.directionId = Number(selectedDirection);
                payload.groupId = Number(selectedGroup);
            }

            await api.post("/news", payload);
            alert("Новость опубликована!");
            setTitle(""); setContent(""); setTargetType("ALL"); setSelectedDirection(""); setSelectedGroup(""); setGroups([]);
        } catch (err) {
            console.error("Ошибка публикации:", err);
            alert(err?.response?.data || err.message || "Ошибка публикации");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-2xl shadow-md max-w-2xl mx-auto space-y-4 dark:bg-gray-800"
        >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Добавить новость</h2>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700 dark:text-gray-300">Цель</label>
                <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                    {TARGETS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {(targetType === "DIRECTION" || targetType === "GROUP") && (
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Выберите направление</label>
                    <select
                        value={selectedDirection}
                        onChange={(e) => setSelectedDirection(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                        <option value="">-- Выберите --</option>
                        {directions.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {targetType === "GROUP" && (
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Выберите группу</label>
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                        <option value="">-- Выберите --</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />

            <textarea
                placeholder="Текст новости"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 h-32 resize-none"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Опубликовать
            </button>
        </form>
    );
}
