import { useEffect, useState } from 'react';
import { createUser, fetchUserById, updateUser, fetchRoles } from '../../api/UsersApi.js';
import { motion } from 'framer-motion';
import SubmitButton from "../Buttons/SubmitButton.jsx";
import CancelButton from "../Buttons/CancelButton.jsx";
import FloatingLabelInput from "../Inputs/FloatingLabelInput.jsx";
import {getAllDirections} from "../../api/DirectionApi.js";
import { useTranslation } from 'react-i18next';
import SelectField from "../Inputs/SelectField.jsx";


const UserForm = ({ userId, onSuccess, onCancel }) => {
    const isEdit = Boolean(userId);
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullname: '',
        role: '',
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
        if (!formData.username.trim()) newErrors.username = t('username_required');
        if (!formData.email.trim()) newErrors.email = t('email_required');
        if (!formData.fullname.trim()) newErrors.fullname = t('fullname_required');
        if (!isEdit && !formData.password.trim()) newErrors.password = t('password_required');
        if (!formData.role.trim()) newErrors.role = t('role_required');
        if (!formData.phonenum || formData.phonenum.length !== 9) newErrors.phonenum = t('phone_required');
        if (formData.role === 'STUDENT' && !formData.directionId) newErrors.directionId = t('direction_required');

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
                <h2 className="text-xl text-textPrimary mb-5 opacity-70 dark:text-blue-200">
                    {isEdit ? t('update_user') : t('create_user')}
                </h2>


                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="fullname"
                        label={t('fullname')}
                        name="fullname"
                        value={formData.fullname}
                        error={errors.fullname}
                        onChange={handleChange}
                    />
                    <FloatingLabelInput
                        id="username"
                        label={t('username')}
                        name="username"
                        value={formData.username}
                        error={errors.username}
                        onChange={handleChange}
                    />
                    <FloatingLabelInput
                        id="email"
                        label={t('email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                    />
                    {!isEdit && (
                        <FloatingLabelInput
                            id="password"
                            label={t('password')}
                            name="password"
                            type="password"
                            value={formData.password}
                            error={errors.password}
                            onChange={handleChange}
                        />
                    )}
                    <FloatingLabelInput
                        id="phonenum"
                        label={t('phone')}
                        name="phonenum"
                        value={formData.phonenum}
                        error={errors.phonenum}
                        onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '');
                            if (digits.length <= 9)
                                setFormData(prev => ({ ...prev, phonenum: digits }));
                        }}
                        leftAddon={<span className="bg-bgSecondary px-3 py-2 text-white select-none rounded-l-md
                        dark:bg-gray-700">+996</span>}
                    />
                    <SelectField
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { value: '', label: t('select_role') },
                            ...roles.map(r => ({
                                value: r.value,
                                label: t(`role.${r.value.toLowerCase()}`)
                            }))
                        ]}
                        error={errors.role}
                    />
                    <FloatingLabelInput
                        id="address"
                        label={t('address')}
                        name="address"
                        value={formData.address}
                        error={errors.address}
                        onChange={handleChange}
                    />
                    {formData.role === 'STUDENT' && (
                        <SelectField
                            id="directionId"
                            name="directionId"

                            value={formData.directionId}
                            onChange={handleChange}
                            options={[
                                { value: '', label: t('select_direction') },
                                ...directions.map(dir => ({
                                    value: dir.id,
                                    label: dir.name
                                }))
                            ]}
                            error={errors.directionId}
                        />
                    )}


                    <div className="relative mb-4 col-span-2">
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="px-4 py-2 rounded-md border border-bgSecondary text-textPrimary
                            dark:text-gray-300 dark:bg-gray-800 dark:border-gray-500 dark:placeholder:text-gray-400"
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
