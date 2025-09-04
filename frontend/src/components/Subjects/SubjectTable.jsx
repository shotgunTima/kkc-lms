import { useEffect, useState } from 'react';
import {
    deleteSubject,
    fetchSubjects
} from '../../api/SubjectApi.js';
import SubjectForm from './SubjectForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';
import ConfirmModal from "../ConfirmModal.jsx";

const SubjectTable = () => {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [subjects, setSubjects] = useState([]); // всегда массив
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '' });

    useEffect(() => {
        loadSubjects();
    }, [filters]);

    const loadSubjects = () => {
        fetchSubjects()
            .then(res => {
                // Если бэкенд вернул объект, а не массив
                let data = res.data;
                if (!Array.isArray(data)) {
                    // например, если Spring Data JPA возвращает Page
                    if (Array.isArray(data.content)) {
                        data = data.content;
                    } else {
                        console.warn("Ответ от API не является массивом:", data);
                        data = [];
                    }
                }
                setSubjects(data);
            })
            .catch(err => {
                console.error(err);
                setSubjects([]); // при ошибке — пустой массив
            });
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const filteredSubjects = Array.isArray(subjects)
        ? subjects.filter((subject) => {
            const name = subject.name || '';
            return !filters.search || name.toLowerCase().includes(filters.search.toLowerCase());
        })
        : [];

    const totalPages = Math.ceil(filteredSubjects.length / PAGE_SIZE);
    const paginatedSubjects = filteredSubjects.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const confirmDelete = (id) => {
        setSubjectToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (subjectToDelete !== null) {
            try {
                await deleteSubject(subjectToDelete);
                loadSubjects();
            } catch (e) {
                console.error(e);
                alert(t('delete_error'));
            } finally {
                setShowConfirm(false);
                setSubjectToDelete(null);
            }
        }
    };

    const handleEdit = async (id) => {
        setEditingSubjectId(id);
        setShowForm(true);
    };


    const handleCreate = () => {
        setEditingSubjectId(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingSubjectId(null);
        loadSubjects();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSubjectId(null);
    };

    const columns = [
        {
            header: t('subject'),
            accessor: 'name',
        },
        {
            header: t('description'),
            accessor: 'description',
            render: val => val || t('no_description')
        },
        {
            header: t('credits'),
            accessor: 'credits',
        },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, subject) => (
                <ActionButtons
                    onEdit={() => handleEdit(subject.id)}
                    onDelete={() => confirmDelete(subject.id)}
                />
            )
        }
    ];

    return (
        <div className="p-6">
            {showForm && (
                <SubjectForm
                    subjectId={editingSubjectId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={handleCreate} />

                <SearchInput
                    value={filters.search}
                    onChange={(newValue) => handleFilterChange('search', newValue)}
                    placeholder={t('search_by_subject_name')}
                    className="placeholder-opacity-50"
                />
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">
                {t('subject_list')}
            </h1>

            <DataTable
                columns={columns}
                data={paginatedSubjects}
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

export default SubjectTable;
