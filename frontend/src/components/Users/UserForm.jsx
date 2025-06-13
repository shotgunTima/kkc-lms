import { useEffect, useState } from 'react';
import { createUser, fetchUserById, updateUser, fetchRoles } from '../../api/UsersApi.js';

import { Check, Save, RefreshCcw, XCircle } from "lucide-react";
import { motion } from 'framer-motion';


const UserForm = ({ userId, onSuccess, onCancel }) => {
    const isEdit = Boolean(userId);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullname: '',
        role: 'STUDENT',
        phonenum: '',
        address: '',
        profileImage: null,
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            fetchUserById(userId)
                .then(res => {
                    const { username, email, fullname, role, phonenum, address } = res.data;
                    setFormData({
                        username,
                        email,
                        fullname,
                        role,
                        phonenum: (phonenum && phonenum.startsWith('+996'))
                            ? phonenum.slice(4)
                            : phonenum || '',
                        address: address || '',
                        password: '',
                        profileImage: null,
                    });
                    setErrors({});
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [userId, isEdit]);

    useEffect(() => {
        fetchRoles()
            .then(res => setRoles(res.data))
            .catch(err => console.error("Ошибка при получении ролей:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        }

        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Полное имя обязательно';
        }

        if (!isEdit && !formData.password.trim()) {
            newErrors.password = 'Пароль обязателен при создании';
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Роль обязательна';
        }

        if (!formData.phonenum || formData.phonenum.length !== 9) {
            newErrors.phonenum = 'Введите 9 цифр после +996';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.warn('Форма не прошла валидацию');
            return;
        }

        setLoading(true);

        try {

            const payload = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                role: formData.role,
                phonenum: `+996${formData.phonenum}`,
                address: formData.address,
            };

            if (!isEdit || formData.password) {
                payload.password = formData.password;
            }

            // Если есть файл — нужно отправлять через FormData, тут пример без файла
            // Если нужен файл — сделай FormData и append все поля + файл

            if (isEdit) {
                await updateUser(userId, payload);
            } else {
                await createUser(payload);
            }

            onSuccess?.();
        } catch (err) {
            const data = err.response?.data;

            if (data && typeof data === 'object') {
                setErrors(data);
            } else {
                alert('Ошибка при отправке данных');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white">

                <h2 className="text-xl text-textPrimary font-medium mb-4">
                    {isEdit ? 'Обновить пользователя' : 'Создать пользователя'}
                </h2>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        name="fullname"
                        placeholder="ФИО"
                        value={formData.fullname}
                        onChange={handleChange}
                        className={`w-full p-2 mb-3 border rounded ${errors.fullname ? 'border-red-500' : ''}`}
                    />
                    {errors.fullname && (
                        <p className="text-red-500 text-sm mb-2">{errors.fullname}</p>
                    )}

                    <input
                        name="username"
                        placeholder="Логин"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-2 mb-1 border rounded ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mb-2">{errors.username}</p>
                    )}

                    <input
                        name="email"
                        type="email"
                        placeholder="Почта"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 mb-1 border rounded ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mb-2">{errors.email}</p>
                    )}

                {!isEdit && (
                    <>
                        <input
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-2 mb-1 border rounded ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
                        )}
                    </>
                )}

                <div className="mb-3">
                    <div className="flex rounded border items-center overflow-hidden">
                        <span className="bg-gray-200 px-3 py-2 text-gray-700 select-none">+996</span>
                        <input
                            type="text"
                            name="phonenum"
                            value={formData.phonenum}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, '');
                                if (onlyDigits.length <= 9) {
                                    setFormData({ ...formData, phonenum: onlyDigits });
                                }
                            }}
                            placeholder="123456789"
                            className={`flex-1 p-2 outline-none ${errors.phonenum ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.phonenum && (
                        <p className="text-red-500 text-sm mt-1">{errors.phonenum}</p>
                    )}
                </div>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full p-2 mb-4 border rounded ${errors.role ? 'border-red-500' : ''}`}
                    >
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mb-2">{errors.role}</p>
                    )}

                <input
                    name="address"
                    placeholder="Адрес"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-2 mb-3 border rounded ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && (
                    <p className="text-red-500 text-sm mb-2">{errors.address}</p>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 mb-1 border rounded"
                />

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="bg-bgSecondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:text-bgSecondary transition hover:bg-bgPrimary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Save className="w-5 h-5" />
                                Сохранение...
                            </>
                        ) : isEdit ? (
                            <>
                                <RefreshCcw className="w-5 h-5" />
                                Обновить
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                Создать
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 text-white bg-textSecondary hover:text-red-200 transition px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        <XCircle className="w-5 h-5" />
                        <span>Закрыть</span>
                    </button>
                </div>
                </div>
            </form>
        </motion.div>
    );
};

export default UserForm;
