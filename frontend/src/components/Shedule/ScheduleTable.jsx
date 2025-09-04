import { useState } from 'react';
// можно переиспользовать под форму расписания
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from '../Buttons/AddButton.jsx';
import { Button } from "@material-tailwind/react";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import ConfirmModal from "../ConfirmModal.jsx";
import { Users, UserCheckIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';

const fakeSchedule = [
    { id: 1, subject: 'Math', teacher: 'Ivanov I.I.', groupName: 'Group A', courseName: '1 курс', day: 'Mon', time: '09:00-10:30' },
    { id: 2, subject: 'Physics', teacher: 'Petrov P.P.', groupName: 'Group B', courseName: '2 курс', day: 'Tue', time: '10:40-12:10' },
    { id: 3, subject: 'Programming', teacher: 'Sidorov S.S.', groupName: 'Group A', courseName: '1 курс', day: 'Wed', time: '12:20-13:50' },
    { id: 4, subject: 'English', teacher: 'Smirnova A.A.', groupName: 'Group B', courseName: '2 курс', day: 'Thu', time: '14:00-15:30' },
];

const ScheduleTable = () => {
    const { t } = useTranslation();
    const [schedule, setSchedule] = useState(fakeSchedule);
    const [filters, setFilters] = useState({ group: '', course: '', search: '' });
    const [modal, setModal] = useState({ type: null, data: null });

    const groups = ['Group A', 'Group B'];
    const courses = ['1 курс', '2 курс'];

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (id) => {
        setSchedule(prev => prev.filter(item => item.id !== id));
        setModal({ type: null, data: null });
    };

    const handleSave = (item) => {
        if (item.id) {
            // редактирование
            setSchedule(prev => prev.map(s => s.id === item.id ? item : s));
        } else {
            // создание
            item.id = Math.max(...schedule.map(s => s.id)) + 1;
            setSchedule(prev => [...prev, item]);
        }
        setModal({ type: null, data: null });
    };

    const filteredSchedule = schedule.filter(item => {
        return (!filters.group || item.groupName === filters.group)
            && (!filters.course || item.courseName === filters.course)
            && (!filters.search || item.subject.toLowerCase().includes(filters.search.toLowerCase()) || item.teacher.toLowerCase().includes(filters.search.toLowerCase()));
    });

    const columns = [
        { header: t("subject"), accessor: 'subject' },
        { header: t("teachers"), accessor: 'teacher' },
        { header: t("group"), accessor: 'groupName' },
        { header: t("courses"), accessor: 'courseName' },
        { header: t("day"), accessor: 'day' },
        { header: t("time"), accessor: 'time' },
        {
            header: t("actions"),
            accessor: 'actions',
            render: (_, item) => (
                <ActionButtons
                    onEdit={() => setModal({ type: 'edit', data: item })}
                    onDelete={() => setModal({ type: 'delete', data: item })}
                />
            ),
        },
    ];

    return (
        <div className="p-6">
            {modal.type === 'create' && (
                <GroupsForm
                    scheduleItem={null}
                    onCancel={() => setModal({ type: null })}
                    onSuccess={handleSave}
                />
            )}
            {modal.type === 'edit' && (
                <GroupsForm
                    scheduleItem={modal.data}
                    onCancel={() => setModal({ type: null })}
                    onSuccess={handleSave}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={() => setModal({ type: 'create', data: null })} />

                <div className="flex items-center gap-4">
                    <FilterBar
                        filters={[
                            { name: 'group', type: 'select', options: [{ label: t("all"), value: '' }, ...groups.map(g => ({ label: g, value: g }))] },
                            { name: 'course', type: 'select', options: [{ label: t("all"), value: '' }, ...courses.map(c => ({ label: c, value: c }))] }
                        ]}
                        values={filters}
                        onChange={handleFilterChange}
                    />

                    <SearchInput
                        value={filters.search}
                        onChange={val => handleFilterChange('search', val)}
                        placeholder={t("search_by_subject_name")}
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">{t("schedule_list")}</h1>
            <DataTable columns={columns} data={filteredSchedule} />

            {modal.type === 'delete' && (
                <ConfirmModal
                    isOpen
                    onCancel={() => setModal({ type: null })}
                    onConfirm={() => handleDelete(modal.data?.id)}
                    title={t("confirm_delete_title")}
                    description={t("confirm_delete_description")}
                    confirmText={t("delete")}
                    cancelText={t("cancel")}
                />
            )}
        </div>
    );
};

export default ScheduleTable;
