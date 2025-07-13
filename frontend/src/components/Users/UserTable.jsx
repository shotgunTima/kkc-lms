import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, fetchRoles } from '../../api/UsersApi.js';
import UserForm from './UserForm';
import FilterBar from '../Filterbar.jsx';
import SearchInput from '../Inputs/SearchInput.jsx';
import { ImageOff, Image} from "lucide-react";
import DataTable from '../DataTable';
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import { useTranslation } from 'react-i18next';


const UserTable = () => {
    const { t } = useTranslation();
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
        { header: t('fullname'), accessor: 'fullname' },
        {
            header: t('role_'),
            accessor: 'role',
            render: (val) => t(`role.${val.toLowerCase()}`)
        },
        { header: t('login'), accessor: 'username' },
        { header: t('email'), accessor: 'email' },
        { header: t('phone'), accessor: 'phonenum' },
        { header: t('address'), accessor: 'address' },
        {
            header: t('photo'),
            accessor: 'profileImage',
            render: (val) =>
                val ? <Image className="w-5 h-5 mx-auto" /> : <ImageOff className="w-5 h-5 mx-auto" />,
        },
        {
            header: t('actions'),
            accessor: 'actions',
            render: (_, user) => (
                <ActionButtons
                    onEdit={() => handleEdit(user.id)}
                    onDelete={() => handleDelete(user.id)}
                />
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
                                options: [{ label: t("all"), value: '' }, ...roles.map(r => ({
                                    label: t(`role.${(r.name || r.value).toLowerCase()}`),
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
                        placeholder={t('search_by_name')}
                        className="placeholder-opacity-50"
                    />
                </div>
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">{t('user_list')}</h1>

            <DataTable columns={columns} data={filteredUsers} />
        </div>
    );
};

export default UserTable;
