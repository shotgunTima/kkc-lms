import React, { useMemo, useState } from 'react';

// WeeklySchedule.jsx — обновлённый компонент (без кнопок редактирования/удаления)
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

// sampleData с полем week
// sampleData с полем week (0 = обе недели, 1 = первая, 2 = вторая)
const sampleData = [
    {
        id: 1,
        day: 'Пн',
        time: '10:00-11:20',
        type: 'Лк.',
        subject: 'Introduction to Programming',
        teacher: 'John Teacher',
        place: '1-корпус, ауд.1/101',
        week: 0, // для всех недель
        group: 'CS-101',
    },
    {
        id: 2,
        day: 'Вт',
        time: '13:00-14:20',
        type: 'Лк.',
        subject: 'Introduction to Programming',
        teacher: 'John Teacher',
        place: '1-корпус, ауд.1/101',
        week: 0,
        group: 'CS-102',
    },
    {
        id: 3,
        day: 'Ср',
        time: '15:00-16:20',
        type: 'Лб.',
        subject: 'Introduction to Programming',
        teacher: 'John Teacher',
        place: '2-корпус, ауд.2/201',
        week: 1, // только первая неделя
        group: 'CS-101',
    },
    {
        id: 4,
        day: 'Ср',
        time: '16:30-17:50',
        type: 'Лб.',
        subject: 'Introduction to Programming',
        teacher: 'John Teacher',
        place: '2-корпус, ауд.2/202',
        week: 2, // только вторая неделя
        group: 'CS-102',
    },
];


const daysOrder = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const QRIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2">
        <rect x="3" y="3" width="6" height="6" stroke="#2563eb" strokeWidth="1.5" fill="#f8fafc" />
        <rect x="15" y="3" width="6" height="6" stroke="#2563eb" strokeWidth="1.5" fill="#f8fafc" />
        <rect x="3" y="15" width="6" height="6" stroke="#2563eb" strokeWidth="1.5" fill="#f8fafc" />
    </svg>
);

export default function WeeklySchedule() {
    const jsDay = new Date().getDay(); // 0..6, 0 = Sunday
    const dayMap = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const todayLabel = dayMap[jsDay] === 'Вс' ? 'Пн' : dayMap[jsDay];

    const [query, setQuery] = useState('');
    const [selectedDay, setSelectedDay] = useState(todayLabel); // null = "Все"
    const [selectedWeek] = useState(0);
    const [showAllWeeks] = useState(true);

    const filterByQuery = (row) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
            row.subject.toLowerCase().includes(q) ||
            row.teacher.toLowerCase().includes(q)
        );
    };

    const filteredData = useMemo(() => {
        return sampleData.filter(d => {
            const weekOk = showAllWeeks ? true : d.week === selectedWeek;
            return weekOk && filterByQuery(d);
        });
    }, [query, selectedWeek, showAllWeeks]);

    const hasEntriesForDay = (day) => filteredData.some(d => d.day === day);
    const hasEntriesForAll = filteredData.length > 0;

    const dayButtonClass = (day) => {
        const isSelected = selectedDay === day;
        const hasEntries = hasEntriesForDay(day);
        if (isSelected && hasEntries) return 'px-3 py-1 rounded-md bg-blue-600 text-white';
        if (isSelected && !hasEntries) return 'px-3 py-1 rounded-md bg-slate-100 text-slate-500 border';
        if (!isSelected && hasEntries) return 'px-3 py-1 rounded-md hover:bg-slate-100 cursor-pointer text-slate-700';
        return 'px-3 py-1 rounded-md text-slate-300 cursor-pointer';
    };

    const allButtonClass = () => {
        const isSelected = selectedDay === null;
        if (isSelected && hasEntriesForAll) return 'px-3 py-1 rounded-md bg-blue-600 text-white';
        if (isSelected && !hasEntriesForAll) return 'px-3 py-1 rounded-md bg-slate-100 text-slate-500 border';
        if (!isSelected && hasEntriesForAll) return 'px-3 py-1 rounded-md hover:bg-slate-100 cursor-pointer text-slate-700';
        return 'px-3 py-1 rounded-md text-slate-300 cursor-pointer';
    };

    const slotsForSelectedDay = useMemo(() => {
        if (selectedDay === null) {
            return filteredData.slice().sort((a,b) => {
                const dayIndex = (d) => daysOrder.indexOf(d);
                const ai = dayIndex(a.day), bi = dayIndex(b.day);
                if (ai !== bi) return ai - bi;
                return times.indexOf(a.time) - times.indexOf(b.time);
            });
        }
        return filteredData
            .filter(d => d.day === selectedDay)
            .sort((a,b) => times.indexOf(a.time) - times.indexOf(b.time));
    }, [filteredData, selectedDay]);

    const groupedByDay = useMemo(() => {
        const map = {};
        slotsForSelectedDay.forEach(s => {
            if (!map[s.day]) map[s.day] = [];
            map[s.day].push(s);
        });
        return map;
    }, [slotsForSelectedDay]);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Расписание</h2>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по предмету или преподавателю"
                        className="px-3 py-2 border rounded-lg shadow-sm w-80 bg-white"
                    />
                </div>
            </div>

            {/* Упрощённая панель навигации (подписи удалены) */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="px-3 py-1 border rounded bg-white"></div>
            </div>

            {/* Day tabs + кнопка Все */}
            <div className="flex items-center gap-2 mb-6">
                {daysOrder.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={dayButtonClass(day)}
                        aria-pressed={selectedDay === day}
                        title={hasEntriesForDay(day) ? 'Есть пары' : 'Пар нет'}
                    >
                        {day}
                    </button>
                ))}

                <button
                    onClick={() => setSelectedDay(null)}
                    className={allButtonClass()}
                    aria-pressed={selectedDay === null}
                    title={hasEntriesForAll ? 'Показать все записи' : 'Записей нет'}
                >
                    Все
                </button>
            </div>

            {/* Основной контент */}
            <div className="grid md:grid-cols-[220px_1fr] gap-6">
                <div className="hidden md:block">
                    <div className="w-52 bg-white rounded-lg shadow p-4 border-l-8 border-blue-500">
                        <div className="text-orange-500 font-bold mb-3">Время</div>
                        <ul className="text-sm text-sky-700 space-y-2">
                            {times.map(t => <li key={t}>{t}</li>)}
                        </ul>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow overflow-hidden border-l-8 border-blue-500">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-orange-500 font-bold text-xl">
                                        {selectedDay === null ? 'Все записи' : selectedDay}
                                    </div>
                                    <div className="text-sm text-slate-500">Все недели</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedDay === null ? (
                                    daysOrder.map(day => {
                                        const list = groupedByDay[day] || [];
                                        return (
                                            <div key={day}>
                                                <div className="text-sm text-slate-600 font-medium mb-2">{day}</div>
                                                {list.length === 0 ? (
                                                    <div className="text-slate-400 mb-2">Пар нет</div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {list.map(slot => (
                                                            <div key={slot.id} className="flex items-start gap-4">
                                                                <div className="w-28 text-sky-700 text-sm hidden md:block">{slot.time}</div>
                                                                <div className="flex-1 py-2">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <QRIcon />
                                                                        <div className="text-sm text-slate-600">{slot.type}</div>
                                                                    </div>
                                                                    <div className="font-semibold text-slate-800">{slot.subject} <span className="font-normal text-slate-600"> {slot.teacher}</span></div>
                                                                    <div className="text-sm text-slate-500 mt-1">{slot.place}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    slotsForSelectedDay.length === 0 ? (
                                        <div className="text-slate-500">Пар нет</div>
                                    ) : (
                                        slotsForSelectedDay.map(slot => (
                                            <div key={slot.id} className="flex items-start gap-4">
                                                <div className="w-28 text-sky-700 text-sm hidden md:block">{slot.time}</div>
                                                <div className="flex-1 py-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <QRIcon />
                                                        <div className="text-sm text-slate-600">{slot.type}</div>
                                                    </div>
                                                    <div className="font-semibold text-slate-800">{slot.subject} <span className="font-normal text-slate-600"> {slot.teacher}</span></div>
                                                    <div className="text-sm text-slate-500 mt-1">{slot.place}</div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
