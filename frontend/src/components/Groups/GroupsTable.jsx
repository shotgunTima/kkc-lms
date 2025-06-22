import { useEffect, useState } from 'react';
import { fetchGroups } from '../../api/GroupsApi.js';
import GroupsForm from './GroupsForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../SearchInput.jsx';
import { CirclePlusIcon, Edit2Icon, TrashIcon} from "lucide-react";
import DataTable from '../DataTable';

const GroupsTable = () => {
    const [groups, setGroups] = useState([]);
    const [updateGroup, setUpdateGroup] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ role: '', search: '' });

    useEffect(() => {
        loadGroups();
        fetchGroups().then(res => setGroups(res.data)).catch(console.error);
    }, []);

    const loadGroups = () => {
        fetchGroups()
            .then(res => setGroups(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
            setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить группу?')) {
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
        loadUsers();
    };

    const handleCancel = () => {
        setShowForm(false);
        setUpdateGroup(null);
    };


    const filteredGroups = groups.filter((group) => {
        const matchesGroup = !filters.group || group.name === filters.name;
        const matchesSearch = !filters.search || group.curator.toLowerCase().includes(filters.search.toLowerCase());
        return matchesGroup && matchesSearch;
    });

    const columns = [
        {header: "Группа", accessor: "name"},
        {header: "Направление", accessor: "direction"},
        {header: "Куратор", accessor: "curator"},
        {
            header:"Действия",
            accessor: "actions",
            render: (_, group) => (
                <div className="flex justify-center gap-4">
                    <Edit2Icon
                        className="w-5 h-5 text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                        onClick={() => handleEdit(group.id)}
                    />
                    <TrashIcon
                        className="w-5 h-5 text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                        onClick={() => handleDelete(group.id)}
                    />
                </div>
            )
        }

    ]

    return (
        <div className="p-6">
            {showForm && (
                <GroupsForm groupId={updateGroup} onSuccess={handleSuccess} onCancel={handleCancel} />
            )}

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 text-white bg-bgSecondary hover:text-bgSecondary transition px-4 py-2 rounded-lg hover:bg-bgPrimary"
                >
                    <CirclePlusIcon className="w-5 h-5" />
                    <span>Добавить</span>
                </button>

                <div className="flex items-center gap-4">
                    <FilterBar
                        filters={[
                            {
                                name: 'group',
                                type: 'select',
                                options: [{ label: 'Все', value: '' }, ...groups.map(r => ({
                                    label: r.label || r.name,
                                    value: r.name || r.value
                                }))],
                            },
                        ]}
                        values={filters}
                        onChange={handleFilterChange}
                    />

                    <SearchInput
                        value={filters.search}
                        onChange={(newValue) => handleFilterChange('search', newValue)}
                        placeholder="Введите имя..."
                        classname="placeholder: text-white"
                    />
                </div>


            </div>

            <h1 className="text-xl text-textPrimary font-medium mb-4">Список групп</h1>
            <DataTable columns={columns} data={filteredGroups} />

        </div>
    );
};

export default GroupsTable;
