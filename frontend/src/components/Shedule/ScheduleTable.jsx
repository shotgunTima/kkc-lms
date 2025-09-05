import React, { useMemo, useState } from 'react';
import { Search } from "lucide-react";

const times = [
    '10:00-11:20',
    '11:30-12:50',
    '13:00-14:20',
    '15:00-16:20',
    '16:30-17:50',
    '18:00-19:20',
    '19:30-20:50',
    '21:00-22:00',
];

const sampleData = [
    { id: 1, day: 'Пн', time: '10:00-11:20', type: 'Лк.', subject: 'Тестирование ПО', teacher: 'Мусина И.Р.', place: '1-корпус, ауд.1/306', week: 0 },
    { id: 2, day: 'Вт', time: '13:00-14:20', type: 'Лк.', subject: 'Тестирование ПО', teacher: 'Мусина И.Р.', place: '1-корпус, ауд.1/306', week: 0 },
    { id: 3, day: 'Вт', time: '15:00-16:20', type: '[2] Лб.', subject: 'Тестирование ПО', teacher: 'Мусина И.Р.', place: '2-корпус, ауд.2/403', week: 0 },
    { id: 4, day: 'Ср', time: '15:00-16:20', type: '[2] Лб.', subject: 'Тестирование ПО', teacher: 'Мусина И.Р.', place: '2-корпус, ауд.2/403', week: 0 },
    { id: 5, day: 'Ср', time: '16:30-17:50', type: '[2] Лб.', subject: 'Тестирование ПО', teacher: 'Мусина И.Р.', place: '2-корпус, ауд.2/403', week: 1 },
];

const daysOrder = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function WeeklySchedule() {
    const jsDay = new Date().getDay();
    const dayMap = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const todayLabel = dayMap[jsDay] === 'Вс' ? 'Пн' : dayMap[jsDay];

    const [query, setQuery] = useState('');
    const [selectedDay, setSelectedDay] = useState(todayLabel);
    const [selectedWeek] = useState(0);
    const [showAllWeeks] = useState(true);

    const filterByQuery = (row) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return row.subject.toLowerCase().includes(q) || row.teacher.toLowerCase().includes(q);
    };

    const filteredData = useMemo(() => {
        return sampleData.filter(d => {
            const weekOk = showAllWeeks ? true : d.week === selectedWeek;
            return weekOk && filterByQuery(d);
        });
    }, [query, selectedWeek, showAllWeeks]);

    const groupedByDay = useMemo(() => {
        const map = {};
        filteredData.forEach(s => {
            if (!map[s.day]) map[s.day] = [];
            map[s.day].push(s);
        });
        return map;
    }, [filteredData]);

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Заголовок и поиск */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl text-slate-800 dark:text-slate-200 opacity-80">Расписание</h1>
                <div className="relative w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-300" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по предмету или преподавателю"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
            </div>

            {/* Табы дней */}
            <div className="flex items-center gap-2 mb-6">
                {daysOrder.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1 rounded-md text-sm ${
                            selectedDay === day
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                        }`}
                    >
                        {day}
                    </button>
                ))}
                <button
                    onClick={() => setSelectedDay(null)}
                    className={`px-3 py-1 rounded-md text-sm ${
                        selectedDay === null
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                    }`}
                >
                    Все
                </button>
            </div>

            {/* Табличный вид с объединением одинаковых дней */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <tr>
                        <th className="px-4 py-2 text-left">День</th>
                        <th className="px-4 py-2 text-left">Время</th>
                        <th className="px-4 py-2 text-left">Тип</th>
                        <th className="px-4 py-2 text-left">Предмет</th>
                        <th className="px-4 py-2 text-left">Преподаватель</th>
                        <th className="px-4 py-2 text-left">Аудитория</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedDay === null
                        ? daysOrder.map(day => {
                            const list = groupedByDay[day] || [];
                            if (list.length === 0) return null;
                            return list.map((slot, index) => (
                                <tr key={slot.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <td className="px-4 py-2" rowSpan={list.length}>{index === 0 ? slot.day : null}</td>
                                    <td className="px-4 py-2 text-sky-700">{slot.time}</td>
                                    <td className="px-4 py-2">{slot.type}</td>
                                    <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{slot.subject}</td>
                                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{slot.teacher}</td>
                                    <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{slot.place}</td>
                                </tr>
                            ));
                        })
                        : (groupedByDay[selectedDay] || []).map(slot => (
                            <tr key={slot.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-700">
                                <td className="px-4 py-2 text-sky-700">{slot.time}</td>
                                <td className="px-4 py-2">{slot.type}</td>
                                <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{slot.subject}</td>
                                <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{slot.teacher}</td>
                                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{slot.place}</td>
                            </tr>
                        ))
                    }
                    {((selectedDay === null && filteredData.length === 0) ||
                        (selectedDay !== null && !(groupedByDay[selectedDay]?.length))) && (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                                Пар нет
                            </td>
                        </tr>
                    )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
