import { useEffect, useState } from 'react';
import { deleteGroup, fetchGroups } from '../../api/GroupsApi.js';
import GroupsForm from './GroupsForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import { Eraser, PencilLine } from 'lucide-react';
import DataTable from '../DataTable.jsx';
import AddButton from '../Buttons/AddButton.jsx';
import { getAllDirections } from '../../api/DirectionApi.js';
import { useTranslation } from 'react-i18next';

const GroupsTable = () => {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [directions, setDirections] = useState([]);
    const [updateGroup, setUpdateGroup] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ direction: '', search: '' });

    useEffect(() => {
        loadGroups();
        getAllDirections()
            .then(res => setDirections(res.data))
            .catch(console.error);
    }, []);

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

    const handleDelete = async (id) => {
        if (window.confirm(t("delete_group_confirm"))) {
            await deleteGroup(id);
            loadGroups();
        }
    };

    const handleEdit = (id) => {
        setUpdateGroup(id);
        setShowForm(true);
    };

    const handleCreate = () => {
        setUpdateGroup(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setUpdateGroup(null);
        loadGroups();
    };

    const handleCancel = () => {
        setShowForm(false);
        setUpdateGroup(null);
    };

    const columns = [
        { header: t("group_name"), accessor: 'name' },
        { header: t("direction"), accessor: 'directionName' },
        { header: t("curator"), accessor: 'curatorFullName' },
        {
            header: t("actions"),
            accessor: 'actions',
            render: (_, group) => (
                <div className="flex justify-center gap-4">
                    <PencilLine
                        title="Изменить"
                        className="w-6 h-6 text-textPrimary hover:text-blue-500 cursor-pointer transition-colors"
                        onClick={() => handleEdit(group.id)}
                    />
                    <Eraser
                        title="Удалить"
                        className="w-6 h-6 text-textSecondary hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => handleDelete(group.id)}
                    />
                </div>
            ),
        },
        { header: t("students_amount"), accessor: 'studentsCount' },
    ];

    return (
        <div className="p-6">
            {showForm && (
                <GroupsForm
                    groupId={updateGroup}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={handleCreate} />

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
        </div>
    );
};

export default GroupsTable;
