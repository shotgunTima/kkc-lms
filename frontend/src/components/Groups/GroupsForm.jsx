import { useEffect, useState } from 'react';
import { createGroup, getGroupById, updateGroup } from '../../api/GroupsApi.js';
import { fetchTeachers } from '../../api/TeachersApi.js';
import { getAllDirections } from '../../api/DirectionApi.js';
import { motion } from 'framer-motion';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';
import SubmitButton from '../Buttons/SubmitButton.jsx';
import CancelButton from '../Buttons/CancelButton.jsx';
import { useTranslation } from 'react-i18next';

const GroupsForm = ({ groupId, onSuccess, onCancel }) => {
    const isEdit = Boolean(groupId);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        direction: '',
        curator: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [directions, setDirections] = useState([]);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getGroupById(groupId)
                .then(res => {
                    const { name, directionId, curatorId } = res.data;
                    setFormData({
                        name,
                        direction: directionId,
                        curator: curatorId,
                    });
                    setErrors({});
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [groupId, isEdit]);

    useEffect(() => {
        fetchTeachers()
            .then(res => setTeachers(res.data))
            .catch(console.error);

        getAllDirections()
            .then(res => setDirections(res.data))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = t("is_required");
        if (!formData.direction.trim()) newErrors.direction = t("select_group_direction");
        if (!formData.curator.trim()) newErrors.curator = t("select_group_curator");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                directionId: formData.direction,
                curatorId: formData.curator,
            };
            isEdit ? await updateGroup(groupId, payload) : await createGroup(payload);
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
                    {isEdit ? t("update_group") : t("create_group")}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="name"
                        label={t("group_name")}
                        name="name"
                        value={formData.name}
                        error={errors.name}
                        onChange={handleChange}
                    />

                    <div className="relative mb-4">
                        <select
                            id="direction"
                            name="direction"
                            value={formData.direction}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-2 rounded-md border bg-white
                            dark:bg-gray-800 dark:border-gray-500 dark:placeholder:text-gray-400 dark:text-gray-300 
                                ${errors.direction ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                                focus:outline-none focus:border-bgSecondary text-textPrimary`}
                        >
                            <option value="" disabled>{t("select_direction")}</option>
                            {directions.map((r, idx) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="relative mb-4">
                        <select
                            id="curator"
                            name="curator"
                            value={formData.curator}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-2 rounded-md border bg-white
                            dark:bg-gray-800 dark:border-gray-500 dark:placeholder:text-gray-400 dark:text-gray-300 
                                ${errors.curator ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                                focus:outline-none focus:border-bgSecondary text-textPrimary`}
                        >
                            <option value="" disabled>{t("select_group_curator")}</option>
                            {teachers.map((t, idx) => (
                                <option key={t.id} value={t.id}>
                                    {t.fullname}
                                </option>

                            ))}
                        </select>

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

export default GroupsForm;
