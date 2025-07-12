import { useEffect, useState } from 'react';
import { deleteGroup, fetchGroups } from '../../api/GroupsApi.js';
import GroupsForm from './GroupsForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../SearchInput.jsx';
import { Eraser, PencilLine } from 'lucide-react';
import DataTable from '../DataTable';
import AddButton from '../Buttons/AddButton.jsx';
import { getAllDirections } from '../../api/DirectionApi.js';

const GroupsTable = () => {
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
        loadGroups();
    };

    const handleCancel = () => {
        setShowForm(false);
        setUpdateGroup(null);
    };

    const columns = [
        { header: 'Группа', accessor: 'name' },
        { header: 'Направление', accessor: 'direction' },
        { header: 'Куратор', accessor: 'curator' },
        {
            header: 'Действия',
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
                                    { label: 'Все', value: '' },
                                    ...directions.map((r, i) => ({
                                        label: r.label || r.name,
                                        value: r.name || r.value,
                                        key: i,
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
                        placeholder="Введите имя куратора..."
                        className="placeholder-opacity-50"
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70">СПИСОК ГРУПП</h1>

            <DataTable columns={columns} data={groups} />
        </div>
    );
};

export default GroupsTable;
