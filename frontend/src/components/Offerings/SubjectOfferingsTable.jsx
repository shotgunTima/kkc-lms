import { useEffect, useState } from 'react';
import { fetchAllOfferings, deleteOffering } from '../../api/CurriculumApi.js';
import OfferingForm from './OfferingForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';
import ConfirmModal from "../ConfirmModal.jsx";
import OfferingDetailModal from "../../modals/OfferingDetailModal.jsx";
import FilterBar from "../Filterbar.jsx";

const SubjectOfferingsTable = () => {
    const { t } = useTranslation();
    const [offerings, setOfferings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingOfferingId, setEditingOfferingId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [offeringToDelete, setOfferingToDelete] = useState(null);
    const [filters, setFilters] = useState({ search: '', credits: 'all' });
    const [viewOfferingId, setViewOfferingId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => loadOfferings(), []);

    const handleView = (id) => {
        setViewOfferingId(id);
        setShowDetails(true);
    };
    const loadOfferings = () => {
        fetchAllOfferings()
            .then(res => setOfferings(res.data))
            .catch(console.error);
    };

    const handleCreate = () => {
        setEditingOfferingId(null);
        setShowForm(true);
    };

    const handleEdit = (id) => {
        setEditingOfferingId(id);
        setShowForm(true);
    };

    const confirmDelete = (id) => {
        setOfferingToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (offeringToDelete) {
            try {
                await deleteOffering(offeringToDelete);
                loadOfferings();
            } catch (e) {
                console.error(e);
                alert(t('delete_error'));
            } finally {
                setShowConfirm(false);
                setOfferingToDelete(null);
            }
        }
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingOfferingId(null);
        loadOfferings();
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditingOfferingId(null);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Поиск + фильтрация
    const filtered = offerings.filter(o => {
        const s = filters.search.toLowerCase();

        const matchesSearch =
            !filters.search ||
            o.subjectName?.toLowerCase().includes(s) ||
            o.subjectCode?.toLowerCase().includes(s);

        const matchesCredits =
            filters.credits === 'all' || String(o.credits) === filters.credits;

        return matchesSearch && matchesCredits;
    });

    const columns = [
        { header: t('subject'), accessor: 'subjectName' },
        { header: t('courses'), accessor: 'course', render: val => t(val) },
        { header: t('semester'), accessor: 'semesterName' },
        { header: t('total_hours'), accessor: 'totalHours' },
        {
            header: t('component_type'),
            accessor: 'components',
            render: (_, o) =>
                o.components?.map(c => `${t(c.type.toLowerCase())} (${c.hours} ч.)`).join(', ') || '–'

        },
        { header: t('capacity'), accessor: 'capacity' },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, o) => (
                <ActionButtons
                    onEdit={() => handleEdit(o.id)}
                    onDelete={() => confirmDelete(o.id)}
                    onView={() => handleView(o.id)}
                />
            )
        }
    ];

    return (
        <div className="p-6">
            {showForm && (
                <OfferingForm
                    offeringId={editingOfferingId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-between items-center mb-6 gap-4">
                <AddButton onClick={handleCreate} />
                <div className="flex items-center gap-4">
                    <FilterBar
                        filters={[
                            {
                                name: 'credits',
                                type: 'select',
                                options: [
                                    { value: 'all', label: t('all_credits') },
                                    ...[1, 2, 3, 4, 5].map(c => ({
                                        value: String(c),
                                        label: `${c} ${t('credit')}`,
                                    })),
                                ],
                            },
                        ]}
                        values={filters}
                        onChange={handleFilterChange}
                    />

                    <SearchInput
                        value={filters.search}
                        onChange={v =>
                            setFilters(prev => ({ ...prev, search: v }))
                        }
                        placeholder={t('search_by_subject_name')}
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filtered} />

            <ConfirmModal
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title={t('confirm_delete_title')}
                description={t('confirm_delete_description')}
                confirmText={t('delete')}
                cancelText={t('cancel')}
            />
            <OfferingDetailModal
                isOpen={showDetails}
                offeringId={viewOfferingId}
                onClose={() => setShowDetails(false)}
            />
        </div>
    );
};

export default SubjectOfferingsTable;
