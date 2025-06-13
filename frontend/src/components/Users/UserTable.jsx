import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, fetchRoles } from '../../api/UsersApi.js';
import UserForm from './UserForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../SearchInput.jsx';
import { CirclePlusIcon, Edit2Icon, TrashIcon, X, Check } from "lucide-react";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ role: '', search: '' });

    useEffect(() => {
        loadUsers();
        fetchRoles().then(res => setRoles(res.data)).catch(console.error);
    }, []);

    const loadUsers = () => {
        fetchUsers()
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

    return (
        <div className="p-6">
            {showForm && (
                <UserForm userId={editingUserId} onSuccess={handleSuccess} onCancel={handleCancel} />
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
                        classname="placeholder: text-white"
                    />
                </div>


            </div>

            <h1 className="text-xl text-textPrimary font-medium mb-4">Список пользователей</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-lg bg-tableColor">
                    <thead>
                    <tr className="bg-bgSecondary text-white text-sm uppercase ">
                        <th className="p-3 text-left border-l border-l-blue-900">ФИО</th>
                        <th className="p-3 text-left border-l border-l-blue-900">Роль</th>
                        <th className="p-3 text-left border-l border-l-blue-900">Логин</th>
                        <th className="p-3 text-left border-l border-l-blue-900">Email</th>
                        <th className="p-3 text-left border-l border-l-blue-900">Тел.</th>
                        <th className="p-3 text-left border-l border-l-blue-900">Адрес</th>
                        <th className="p-3 text-center border-l border-l-blue-900">Фото</th>
                        <th className="p-3 text-center border-l border-l-blue-900">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-300 transition-colors duration-200 text-sm"
                            >
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.fullname}</td>
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.roleLabel}</td>
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.username}</td>
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.email}</td>
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.phonenum}</td>
                                <td className="p-3 border border-gray-300 text-textPrimary">{user.address}</td>
                                <td className="p-3 border border-gray-300 text-center">
                                    {user.profileImage ? (
                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500 mx-auto" />
                                    )}
                                </td>
                                <td className="p-3 border-b border-gray-300 text-center">
                                    <div className="flex justify-center gap-4">
                                        <Edit2Icon
                                            className="w-5 h-5 text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                                            onClick={() => handleEdit(user.id)}
                                        />
                                        <TrashIcon
                                            className="w-5 h-5 text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                                            onClick={() => handleDelete(user.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-4 text-center text-gray-700 bg-tableColor">
                                Нет пользователей
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default UserTable;
