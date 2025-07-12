import { useEffect, useState } from 'react';
import { getAllDirections, deleteDirection } from '../../api/DirectionApi.js';
import DirectionForm from './DirectionForm.jsx';
import SearchInput from '../SearchInput.jsx';
import { PencilLine, Eraser} from "lucide-react";
import DataTable from '../DataTable';
import AddButton from "../Buttons/AddButton.jsx";

const DirectionTable = () => {
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

    const handleDelete = async (id) => {
        if (window.confirm('Удалить направление?')) {
            await deleteDirection(id);
            loadDirections();
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
        { header: 'Направление', accessor: 'name' },

        {
            header: 'Действия',
            accessor: 'actions',
            render: (_, direction) => (
                <div className="flex justify-center gap-4">
                    <PencilLine
                        title="Изменить"
                        className="w-6 h-6 text-textPrimary hover:text-blue-500 cursor-pointer transition-colors"
                        onClick={() => handleEdit(direction.id)}
                    />
                    <Eraser
                        title="Удалить"
                        className="w-6 h-6 text-textSecondary hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => handleDelete(directions.id)}
                    />
                </div>
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
                        placeholder="Введите название..."
                        className="placeholder-opacity-50"
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70">СПИСОК НАПРАВЛЕНИЙ</h1>

            <DataTable columns={columns} data={filteredDirections} />
        </div>
    );
};

export default DirectionTable;
