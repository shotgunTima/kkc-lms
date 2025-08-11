import { useEffect, useState } from 'react';
import { getAllDirections} from '../../api/DirectionApi.js';
import DirectionForm from './DirectionForm.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import ActionButtons from "../Buttons/ActionButtons.jsx";
import DataTable from '../DataTable.jsx';
import AddButton from "../Buttons/AddButton.jsx";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../ConfirmModal.jsx";
import {deleteUser} from "../../api/UsersApi.js";


const DirectionTable = () => {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [directionToDelete, setDirectionToDelete] = useState(null);
    const [directions, setDirections] = useState([]);
    // const [roles, setRoles] = useState([]);
    const [editingDirectionId, setEditingDirectionsId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '' });

    useEffect(() => {
        loadDirections();
        // fetchRoles().then(res => setRoles(res.data)).catch(console.error);
    }, [filters]);

    const loadDirections = () => {
        getAllDirections({
            search: filters.search
        })
            .then(res => setDirections(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const confirmDelete = (id) => {
        setDirectionToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (directionToDelete !== null) {
            await deleteUser(directionToDelete);
            loadDirections();
            setShowConfirm(false);
            setDirectionToDelete(null);
        }
    };

    const handleEdit = (id) => {
        setEditingDirectionsId(id);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingDirectionsId(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingDirectionsId(null);
        loadDirections();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingDirectionsId(null);
    };

    const filteredDirections = directions.filter((direction) =>
        !filters.search || direction.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    const columns = [
        { header: t('direction'), accessor: 'name' },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, direction) => (
                <ActionButtons
                    onEdit={() => handleEdit(direction.id)}
                    onDelete={() => confirmDelete(direction.id)}
                />
            ),
        },
    ];


    return (
        <div className="p-6">
            {showForm && (
                <DirectionForm directionId={editingDirectionId} onSuccess={handleSuccess} onCancel={handleCancel} />
            )}

            <div className="flex justify-between items-center mb-6">

                <AddButton onClick={handleCreate} />

                <div className="flex items-center gap-4">


                    <SearchInput
                        value={filters.search}
                        onChange={(newValue) => handleFilterChange('search', newValue)}
                        placeholder={t("enter_direction_name")}
                        className="placeholder-opacity-50"
                    />

                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">
                {t('direction_list')}
            </h1>


            <DataTable columns={columns} data={filteredDirections} />
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

export default DirectionTable;
