import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, fetchRoles } from '../../api/UsersApi.js';
import UserForm from './UserForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../SearchInput.jsx';
import { PencilLine, Eraser, ImageOff, Image} from "lucide-react";
import DataTable from '../DataTable';

import AddButton from "../Buttons/AddButton.jsx";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ role: '', search: '' });

    useEffect(() => {
        loadUsers();
        fetchRoles().then(res => setRoles(res.data)).catch(console.error);
    }, [filters]);

    const loadUsers = () => {
        fetchUsers({
            role: filters.role,
            search: filters.search
        })
            .then(res => setUsers(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить пользователя?')) {
            await deleteUser(id);
            loadUsers();
        }
    };

    const handleEdit = (id) => {
        setEditingUserId(id);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingUserId(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingUserId(null);
        loadUsers();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUserId(null);
    };

    const filteredUsers = users.filter((user) => {
        const matchesRole = !filters.role || user.role === filters.role;
        const matchesSearch = !filters.search || user.fullname.toLowerCase().includes(filters.search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const columns = [
        { header: 'ФИО', accessor: 'fullname' },
        { header: 'Роль', accessor: 'roleLabel' },
        { header: 'Логин', accessor: 'username' },
        { header: 'Email', accessor: 'email' },
        { header: 'Тел.', accessor: 'phonenum' },
        { header: 'Адрес', accessor: 'address' },
        {
            header: 'Фото',
            accessor: 'profileImage',
            render: (val) =>
                val ? <Image className="w-5 h-5 mx-auto" /> : <ImageOff className="w-5 h-5 mx-auto" />,
        },
        {
            header: 'Действия',
            accessor: 'actions',
            render: (_, user) => (
                <div className="flex justify-center gap-4">
                    <PencilLine
                        title="Изменить"
                        className="w-6 h-6 text-textPrimary hover:text-blue-500 cursor-pointer transition-colors"
                        onClick={() => handleEdit(user.id)}
                    />
                    <Eraser
                        title="Удалить"
                        className="w-6 h-6 text-textSecondary hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => handleDelete(user.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            {showForm && (
                <UserForm userId={editingUserId} onSuccess={handleSuccess} onCancel={handleCancel} />
            )}

            <div className="flex justify-between items-center mb-6">

                <AddButton onClick={handleCreate} />

                <div className="flex items-center gap-4">
                    <FilterBar
                        filters={[
                            {
                                name: 'role',
                                type: 'select',
                                options: [{ label: 'Все', value: '' }, ...roles.map(r => ({
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
                        className="placeholder-opacity-50"
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70">СПИСОК ПОЛЬЗОВАТЕЛЕЙ</h1>

            <DataTable columns={columns} data={filteredUsers} />
        </div>
    );
};

export default UserTable;
