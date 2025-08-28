import { useEffect, useState } from 'react';
import { fetchStudents, deleteStudent } from '../../api/StudentApi.js';
import UserForm from '../Users/UserForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';
import ConfirmModal from "../ConfirmModal.jsx";
import TransferStudentModal from '../../modals/TransferStudentModal.jsx';
import {UserIcon, ArrowRightIcon, UserCheckIcon} from "lucide-react";


const StudentTable = () => {
    const { t } = useTranslation();
    const [students, setStudents] = useState([]);
    const [filters, setFilters] = useState({ search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // единое состояние модалки
    const [modal, setModal] = useState({ type: null, data: null });

    useEffect(() => {
        loadStudents();
    }, []);

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

    const handleDelete = async (id) => {
        try {
            await deleteStudent(id);
            loadStudents();
        } catch (e) {
            console.error(e);
            alert(t('delete_error'));
        } finally {
            setModal({ type: null, data: null });
        }
    };

    const columns = [
        { header: t('fullname'), accessor: 'fullname' },
        { header: t('student_id'), accessor: 'studentIdNumber' },
        { header: t('direction'), accessor: 'directionName' },
        { header: t('group'), accessor: 'groupName' },
        {
            header: t('status'),
            accessor: 'status',
            render: val => t(`student_status.${val?.toLowerCase()}`)
        },
        {
            header: t('courses'),
            accessor: 'course',
            render: val => t(val)
        },
        { header: t('admission_year'), accessor: 'admissionYear' },
        {
            header: t('contract_paid'),
            accessor: 'contractPaid',
            render: val => val ? t('yes') : t('no')
        },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, student) => (
                <div className="flex items-center gap-2">
                    <ActionButtons
                        onEdit={() => setModal({ type: 'edit', data: student })}
                        onDelete={() => setModal({ type: 'delete', data: student })}
                    />
                    <button
                        onClick={() => setModal({ type: 'transfer', data: student })}
                        className="rounded-full p-1 text-sm transition-colors"
                        title={t("transfer_student")}
                    >
                        <div className="flex items-center ">
                            <UserIcon className="w-6 h-6 text-bgSecondary dark:text-gray-300 " />
                            <ArrowRightIcon className="w-6 h-6 text-bgSecondary dark:text-gray-300 " />
                        </div>
                    </button>

                </div>
            )
        }
    ];

    return (
        <div className="p-6">

            {modal.type === 'create' && (
                <UserForm
                    fixedRole="STUDENT"
                    onSuccess={() => { setModal({ type: null }); loadStudents(); }}
                    onCancel={() => setModal({ type: null })}
                />
            )}

            {modal.type === 'edit' && (
                <UserForm
                    userId={modal.data?.userId}
                    studentId={modal.data?.id}
                    fixedRole="STUDENT"
                    onSuccess={() => { setModal({ type: null }); loadStudents(); }}
                    onCancel={() => setModal({ type: null })}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={() => setModal({ type: 'create' })} />
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

            {/* --- Централизованные модалки --- */}



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

            {modal.type === 'transfer' && (
                <TransferStudentModal
                    isOpen
                    initialStudentId={modal.data?.id}   // предзаполняем студента
                    onClose={() => setModal({ type: null })}
                    onSuccess={loadStudents}
                />
            )}

        </div>
    );
};

export default StudentTable;
