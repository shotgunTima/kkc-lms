import { useEffect, useState } from 'react';
import { deleteGroup, fetchGroups } from '../../api/GroupsApi.js';
import GroupsForm from './GroupsForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import DataTable from '../DataTable.jsx';
import AddButton from '../Buttons/AddButton.jsx';
import { getAllDirections } from '../../api/DirectionApi.js';
import { useTranslation } from 'react-i18next';
import { Button } from "@material-tailwind/react";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import ConfirmModal from "../ConfirmModal.jsx";
import AssignCuratorModal from '../../modals/AssignCuratorModal.jsx';
import AssignedCuratorsBulkModal from '../../modals/AssignedCuratorsBulkModal.jsx';
import DistributeStudentsModal from '../../modals/DistributeStudentsModal.jsx';
import { UserCheckIcon, Users } from "lucide-react";



const GroupsTable = () => {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [directions, setDirections] = useState([]);
    const [filters, setFilters] = useState({ direction: '', search: '' });

    // единое состояние модалки
    const [modal, setModal] = useState({ type: null, data: null });

    useEffect(() => {
        loadGroups();
        getAllDirections()
            .then(res => setDirections(res.data))
            .catch(console.error);
    }, [filters]);

    const loadGroups = () => {
        fetchGroups({
            direction: filters.direction,
            search: filters.search
        })
            .then(res => setGroups(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // действия
    const handleDelete = async (id) => {
        try {
            await deleteGroup(id);
            loadGroups();
        } finally {
            setModal({ type: null, data: null });
        }
    };

    const columns = [
        { header: t("group_name"), accessor: 'name' },
        { header: t("direction"), accessor: 'directionName' },
        { header: t("curator"), accessor: 'curatorFullName' },
        {
            header: t("students_amount"),
            accessor: 'studentsCount'
        },
        {
            header: t("actions"),
            accessor: 'actions',
            render: (_, group) => (
                <div className="flex items-center gap-2">
                    <ActionButtons
                        onEdit={() => setModal({ type: 'edit', data: group })}
                        onDelete={() => setModal({ type: 'delete', data: group })}
                    />
                    <button
                        onClick={() => setModal({ type: 'assign-curator', data: group })}
                        className="flex items-center gap-2 px-3 rounded-full  transition-colors"
                        title={t("assign_curator")}
                    >
                        <UserCheckIcon className="w-6 h-6 text-bgSecondary hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300" />
                    </button>

                </div>
            ),
        },
    ];

    return (
        <div className="p-6">

            {modal.type === 'create' && (
                <GroupsForm
                    groupId={null}
                    onSuccess={() => { setModal({ type: null }); loadGroups(); }}
                    onCancel={() => setModal({ type: null })}
                />
            )}

            {modal.type === 'edit' && (
                <GroupsForm
                    groupId={modal.data?.id}
                    onSuccess={() => { setModal({ type: null }); loadGroups(); }}
                    onCancel={() => setModal({ type: null })}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={() => setModal({ type: 'create', data: null })} />

                <div className="flex gap-5">
                    <Button
                        onClick={() => setModal({ type: 'distribute' })}
                        className="group flex items-center justify-start px-3 h-11 rounded-lg
               bg-bgSecondary text-white text-sm normal-case
               shadow-black-around hover:bg-opacity-90
               dark:bg-gray-900 dark:hover:bg-gray-700
               transition-all duration-300 gap-2"
                    >
                        <Users className="w-6 h-6" />
                        <span className="whitespace-nowrap normal-case">{t("distribute_students_l")}</span>
                    </Button>

                    <Button
                        onClick={() => setModal({ type: 'assign-curators-bulk' })}
                        className="group flex items-center justify-start px-3 h-11 rounded-lg
               bg-bgSecondary text-white text-sm normal-case
               shadow-black-around hover:bg-opacity-90
               dark:bg-gray-900 dark:hover:bg-gray-700
               transition-all duration-300 gap-2"
                    >
                        <UserCheckIcon className="w-6 h-6 shrink-0" />
                        <span className="whitespace-nowrap normal-case">{t("assign_curators_bulk_l")}</span>
                    </Button>

                </div>

                <div className="flex items-center gap-4">
                    <FilterBar
                        filters={[
                            {
                                name: 'direction',
                                type: 'select',
                                options: [
                                    { label: t("all"), value: '' },
                                    ...directions.map(r => ({
                                        label: r.name,
                                        value: r.name,
                                    }))
                                ],
                            },
                        ]}
                        values={filters}
                        onChange={handleFilterChange}
                    />

                    <SearchInput
                        value={filters.search}
                        onChange={val => handleFilterChange('search', val)}
                        placeholder={t("enter_curator_name")}
                        className="placeholder-opacity-50"
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">{t("group_list")}</h1>

            <DataTable columns={columns} data={groups} />

            {/* --- Централизованные модалки --- */}


            {modal.type === 'delete' && (
                <ConfirmModal
                    isOpen
                    onCancel={() => setModal({ type: null })}
                    onConfirm={async () => { await deleteGroup(modal.data?.id); setModal({ type: null }); loadGroups(); }}
                    title={t("confirm_delete_title")}
                    description={t("confirm_delete_description")}
                    confirmText={t("delete")}
                    cancelText={t("cancel")}
                />
            )}

            {modal.type === 'distribute' && (
                <DistributeStudentsModal
                    isOpen
                    onClose={() => setModal({ type: null })}
                    onSuccess={loadGroups}
                />
            )}

            {modal.type === 'assign-curator' && (
                <AssignCuratorModal
                    isOpen
                    groupId={modal.data?.id}     // важно: передаём группу!
                    onClose={() => setModal({ type: null })}
                    onSuccess={loadGroups}
                />
            )}

            {modal.type === 'assign-curators-bulk' && (
                <AssignedCuratorsBulkModal
                    isOpen
                    onClose={() => setModal({ type: null })}
                    onSuccess={loadGroups}
                />
            )}

        </div>
    );
};

export default GroupsTable;
