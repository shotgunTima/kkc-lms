import { useEffect, useState } from 'react';
import {
    fetchStudents,
    deleteStudent
} from '../../api/StudentApi.js';
import UserForm from '../Users/UserForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';
import ConfirmModal from "../ConfirmModal.jsx";

const StudentTable = () => {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '' });

    useEffect(() => {
        loadStudents();
    }, [filters]);

    const loadStudents = () => {
        fetchStudents()
            .then(res => setStudents(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const filteredStudents = students.filter(student => {
        const name = student.fullname || '';
        return !filters.search || name.toLowerCase().includes(filters.search.toLowerCase());
    });

    const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const confirmDelete = id => {
        setStudentToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (studentToDelete !== null) {
            try {
                await deleteStudent(studentToDelete);
                loadStudents();
            } catch (e) {
                console.error(e);
                alert(t('delete_error'));
            } finally {
                setShowConfirm(false);
                setStudentToDelete(null);
            }
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingStudent(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingStudent(null);
        loadStudents();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingStudent(null);
    };

    const columns = [
        {
            header: t('fullname'),
            accessor: 'fullname'
        },
        {
            header: t('student_id'),
            accessor: 'studentIdNumber',
        },
        {
            header: t('direction'),
            accessor: 'directionName'
        },
        {
            header: t('group'),
            accessor: 'groupName'
        },
        {
            header: t('status'),
            accessor: 'status',
            render: val => t(`student_status.${val?.toLowerCase()}`)
        },
        {
            header: t('courses'),
            accessor: 'course',
            render: val => val ? t(val) : ''
        },
        {
            header: t('admission_year'),
            accessor: 'admissionYear'
        },
        {
            header: t('contract_paid'),
            accessor: 'contractPaid',
            render: val => val ? t('yes') : t('no')
        },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, student) => (
                <ActionButtons
                    onEdit={() => handleEdit(student)}
                    onDelete={() => confirmDelete(student.id)}
                />
            )
        }
    ];

    return (
        <div className="p-6">
            {showForm && (
                <UserForm
                    userId={editingStudent?.userId}
                    studentId={editingStudent?.id}
                    fixedRole="STUDENT"
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
                {t('student_list')}
            </h1>

            <DataTable
                columns={columns}
                data={paginatedStudents}
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

export default StudentTable;
