// src/components/News/NewsForm.jsx
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
            .catch((err) => {
                console.error("Failed to load directions:", err);
                setDirections([]);
            });
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
            .catch((err) => {
                console.error("Failed to load groups for direction:", err);
                setGroups([]);
            });
    }, [selectedDirection]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return alert("Введите заголовок");
        if (!content.trim()) return alert("Введите текст новости");

        try {
            const payload = {
                title: title.trim(),
                content: content.trim(),
                targetType, // строка "ALL" | "DIRECTION" | "GROUP"
            };

            if (targetType === "DIRECTION") {
                if (!selectedDirection) return alert("Выберите направление");
                payload.directionId = Number(selectedDirection);
            }

            if (targetType === "GROUP") {
                if (!selectedDirection || !selectedGroup)
                    return alert("Выберите направление и группу");
                payload.directionId = Number(selectedDirection);
                payload.groupId = Number(selectedGroup);
            }

            await api.post("/news", payload);
            alert("Новость опубликована!");
            setTitle("");
            setContent("");
            setTargetType("ALL");
            setSelectedDirection("");
            setSelectedGroup("");
            setGroups([]);
        } catch (err) {
            console.error("Ошибка публикации:", err);
            alert(err?.response?.data || err.message || "Ошибка публикации");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded max-w-xl">
            <h2 className="text-xl font-bold mb-2">Добавить новость</h2>

            <label className="block mb-2">
                Цель
                <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full border p-2 mb-2"
                >
                    {TARGETS.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </label>

            {targetType === "DIRECTION" && (
                <label className="block mb-2">
                    Выберите направление
                    <select
                        className="w-full border p-2 mb-2"
                        value={selectedDirection}
                        onChange={(e) => setSelectedDirection(e.target.value)}
                    >
                        <option value="">-- Выберите --</option>
                        {directions.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {targetType === "GROUP" && (
                <>
                    <label className="block mb-2">
                        Выберите направление
                        <select
                            className="w-full border p-2 mb-2"
                            value={selectedDirection}
                            onChange={(e) => setSelectedDirection(e.target.value)}
                        >
                            <option value="">-- Выберите --</option>
                            {directions.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block mb-2">
                        Выберите группу
                        <select
                            className="w-full border p-2 mb-2"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="">-- Выберите --</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </>
            )}

            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-2"
            />

            <textarea
                placeholder="Текст"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border p-2 mb-2"
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Опубликовать
            </button>
        </form>
    );
}
