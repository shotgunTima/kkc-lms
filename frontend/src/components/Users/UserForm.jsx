import { useEffect, useState } from 'react';
import { createUser, fetchUserById, updateUser, fetchRoles } from '../../api/UsersApi.js';
import { motion } from 'framer-motion';
import SubmitButton from "../Buttons/SubmitButton.jsx";
import CancelButton from "../Buttons/CancelButton.jsx";
import FloatingLabelInput from "../Inputs/FloatingLabelInput.jsx";
import {getAllDirections} from "../../api/DirectionApi.js";

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
        directionId: '',
    });

    const [roles, setRoles] = useState([]);
    const [directions, setDirections] = useState([]);
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
                        phonenum: phonenum?.startsWith('+996') ? phonenum.slice(4) : phonenum || '',
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

    useEffect(() => {
        getAllDirections()
            .then(res => setDirections(res.data))
            .catch(err => console.error("Ошибка при получении направлений", err));

    })

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) setFormData(prev => ({ ...prev, profileImage: file }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Имя пользователя обязательно';
        if (!formData.email.trim()) newErrors.email = 'Email обязателен';
        if (!formData.fullname.trim()) newErrors.fullname = 'Полное имя обязательно';
        if (!isEdit && !formData.password.trim()) newErrors.password = 'Пароль обязателен при создании';
        if (!formData.role.trim()) newErrors.role = 'Роль обязательна';
        if (!formData.phonenum || formData.phonenum.length !== 9) newErrors.phonenum = 'Введите 9 цифр после +996';
        if (!formData.address.trim()) newErrors.address = 'Введите адрес';
        if (formData.role === 'STUDENT' && !formData.directionId) newErrors.directionId = 'Выберите направление';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                role: formData.role,
                phonenum: `+996${formData.phonenum}`,
                address: formData.address,
                ...(formData.password && { password: formData.password }),
                ...(formData.role === 'STUDENT' && { directionId: formData.directionId }),
            };
            isEdit ? await updateUser(userId, payload) : await createUser(payload);
            onSuccess?.();
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object') setErrors(data);
            else alert('Ошибка при отправке данных');
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
            <form onSubmit={handleSubmit} className="mb-40">
                <h2 className="text-xl text-textPrimary mb-5 opacity-70 ">
                    {isEdit ? 'ОБНОВИТЬ ПОЛЬЗОВАТЕЛЯ' : 'СОЗДАТЬ ПОЛЬЗОВАТЕЛЯ'}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="fullname"
                        label="ФИО"
                        name="fullname"
                        value={formData.fullname}
                        error={errors.fullname}
                        onChange={handleChange}
                    />
                    <FloatingLabelInput
                        id="username"
                        label="Логин"
                        name="username"
                        value={formData.username}
                        error={errors.username}
                        onChange={handleChange}
                    />
                    <FloatingLabelInput
                        id="email"
                        label="Почта"
                        name="email"
                        type="email"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                    />
                    {!isEdit && (
                        <FloatingLabelInput
                            id="password"
                            label="Пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            error={errors.password}
                            onChange={handleChange}
                        />
                    )}
                    <FloatingLabelInput
                        id="phonenum"
                        label="Номер телефона"
                        name="phonenum"
                        value={formData.phonenum}
                        error={errors.phonenum}
                        onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '');
                            if (digits.length <= 9)
                                setFormData(prev => ({ ...prev, phonenum: digits }));
                        }}
                        leftAddon={<span className="bg-bgSecondary px-3 py-2 text-white select-none rounded-l-md">+996</span>}
                    />
                    <div className="relative mb-4">
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-2 rounded-md border bg-white text-textPrimary text-opacity-60
                                hover:text-textPrimary hover:text-opacity-100
                                ${errors.role ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                                focus:outline-none focus:border-bgSecondary`}
                        >
                            <option value="" disabled hidden />
                            {roles.map(r => (
                                <option  key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.role === 'STUDENT' && (
                        <div className="relative mb-4 col-span-2">

                            <select
                                id="directionId"
                                name="directionId"
                                value={formData.directionId}
                                onChange={handleChange}
                                className={`peer w-full px-4 py-2 rounded-md border bg-white text-textPrimary text-opacity-60
                                hover:text-textPrimary hover:text-opacity-100
                                ${errors.directionId ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                                focus:outline-none focus:border-bgSecondary`}
                            >
                                <option value="">Выберите направление</option>
                                {directions.map(dir => (
                                    <option key={dir.id} value={dir.id}>
                                        {dir.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <FloatingLabelInput
                        id="address"
                        label="Адрес"
                        name="address"
                        value={formData.address}
                        error={errors.address}
                        onChange={handleChange}
                    />

                    <div className="relative mb-4 col-span-2">
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="px-4 py-2 rounded-md border border-bgSecondary text-textPrimary"
                        />
                    </div>

                    <div className="flex items-center gap-4 col-span-2">
                        <SubmitButton isEdit={isEdit} loading={loading} onClick={handleSubmit} />
                        <CancelButton onClick={onCancel} />
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default UserForm;
