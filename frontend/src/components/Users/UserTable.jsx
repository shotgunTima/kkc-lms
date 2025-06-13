import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../api/UsersApi.js';
import UserForm from './UserForm';
import { CirclePlusIcon, Edit2Icon, TrashIcon, X, Check } from "lucide-react";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadUsers = () => {
        fetchUsers()
            .then(res => setUsers(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        loadUsers();
    }, []);

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

    return (
        <div className="p-6">

            {showForm && (
                <UserForm userId={editingUserId} onSuccess={handleSuccess} onCancel={handleCancel} />
            )}

            <button
                onClick={handleCreate}
                className="flex items-center gap-2 text-white bg-bgSecondary hover:text-bgSecondary transition px-4 py-2 rounded-lg hover:bg-bgPrimary" // Добавлены отступы, скругление и фон при наведении
            >
                <CirclePlusIcon className="w-5 h-5" />
                <span>Добавить</span>
            </button>

            <h1 className="text-xl text-textPrimary font-medium mt-8 mb-4">Список пользователей</h1>

            <table className="w-full border-collapse border border-bgSecondary rounded-lg overflow-hidden mt-4 text-white shadow-md"
            >
                <thead className="bg-bgSecondary">
                <tr>
                    <th className="border border-r-blue-900 p-2">ФИО</th>
                    <th className="border border-r-blue-900 p-2">Роль</th>
                    <th className="border border-r-blue-900 p-2">Логин</th>
                    <th className="border border-r-blue-900 p-2">Email</th>
                    <th className="border border-r-blue-900 p-2">Тел.</th>
                    <th className="border border-r-blue-900 p-2">Адрес</th>
                    <th className="border border-r-blue-900 p-2">Фото</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="text-center bg-tableColor hover:bg-gray-300 transition">
                        <td className="border p-2 text-textPrimary">{user.fullname}</td>
                        <td className="border p-2 text-textPrimary">{user.roleLabel}</td>
                        <td className="border p-2 text-textPrimary">{user.username}</td>
                        <td className="border p-2 text-textPrimary">{user.email}</td>
                        <td className="border p-2 text-textPrimary">{user.phonenum}</td>
                        <td className="border p-2 text-textPrimary">{user.address}</td>
                        <td className="border p-2 text-textPrimary text-center align-center justify-center">
                            {user.profileImage
                                ? <Check className="w-7 h-7 text-green-500" />
                                : <X className="w-7 h-7 text-textSecondary" />
                            }
                        </td>


                        <td className="border p-2text-textPrimary">
                            <div className="flex justify-center items-center gap-3">
                                <Edit2Icon
                                    className="w-7 h-7 text-blue-800 hover:text-blue-600 cursor-pointer"
                                    onClick={() => handleEdit(user.id)}
                                />
                                <TrashIcon
                                    className="w-7 h-7 text-red-700 cursor-pointer hover:text-red-500"
                                    onClick={() => handleDelete(user.id)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}

                {users.length === 0 && (
                    <tr>
                        <td colSpan="10" className="text-center p-4 text-gray-500 bg-tableColor">
                            Нет пользователей
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
