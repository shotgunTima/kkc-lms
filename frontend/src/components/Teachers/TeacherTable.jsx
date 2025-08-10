import { useEffect, useState } from 'react';
import {
    fetchTeachers,
    deleteTeacher
} from '../../api/TeachersApi.js';
import UserForm from '../Users/UserForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';
import ConfirmModal from "../ConfirmModal.jsx";

const TeacherTable = () => {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [editingTeacherId, setEditingTeacherId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '' });

    useEffect(() => {
        loadTeachers();
    }, [filters]);

    const loadTeachers = () => {
        fetchTeachers()
            .then(res => setTeachers(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const filteredTeachers = teachers.filter(teacher => {
        const name = teacher.fullname || '';
        return !filters.search || name.toLowerCase().includes(filters.search.toLowerCase());
    });

    const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const confirmDelete = id => {
        setTeacherToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (teacherToDelete !== null) {
            try {
                await deleteTeacher(teacherToDelete);
                loadTeachers();
            } catch (e) {
                console.error(e);
                alert(t('delete_error'));
            } finally {
                setShowConfirm(false);
                setTeacherToDelete(null);
            }
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacherId(teacher.id);  // передаем только ID
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingTeacherId(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingTeacherId(null);
        loadTeachers();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTeacherId(null);
    };

    const columns = [
        {
            header: t('fullname'),
            accessor: 'fullname'
        },
        {
            header: t('academic_title'),
            accessor: 'academicTitle',
            render: val => t(`academic_titles.${val?.toLowerCase()}`)
        },
        {
            header: t('subjects'),
            accessor: 'subjectNames',
            render: val => Array.isArray(val) ? val.join(', ') : '—'
        },
        {
            header: t('phone'),
            accessor: 'phonenum',
        },
        {
            header: t('status'),
            accessor: 'teacherStatus',
            render: val => t(`teacher_status.${val?.toLowerCase()}`)
        },
        {
            header: t('hire_date'),
            accessor: 'hireDate'
        },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, teacher) => (
                <ActionButtons
                    onEdit={() => handleEdit(teacher)}
                    onDelete={() => confirmDelete(teacher.id)}
                />
            )
        }
    ];

    return (
        <div className="p-6">
            {showForm && (
                <UserForm
                    userId={editingTeacherId}
                    fixedRole="TEACHER"
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={handleCreate} />
                <SearchInput
                    value={filters.search}
                    onChange={newValue => handleFilterChange('search', newValue)}
                    placeholder={t('enter_name')}
                    className="placeholder-opacity-50"
                />
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">
                {t('teacher_list')}
            </h1>


            <DataTable
                columns={columns}
                data={paginatedTeachers}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <ConfirmModal
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title={t("confirm_delete_title")}
                description={t("confirm_delete_description")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
            />
        </div>
    );
};

export default TeacherTable;
