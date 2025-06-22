import { useEffect, useState } from 'react';
import { createGroup, getGroupById, updateGroup } from '../../api/GroupsApi.js';
import {getAllTeachers} from "../../api/TeachersApi";
import {getAllDirections} from "../../api/DirectionApi.js";

import { Check, Save, RefreshCcw, XCircle } from "lucide-react";
import { motion } from 'framer-motion';


const GroupsForm = ({ groupId, onSuccess, onCancel }) => {
    const isEdit = Boolean(groupId);

    const [formData, setFormData] = useState({
        name: '',
        direction: '',
        curator: '',

    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [directions, setDirection] = useState([]);


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getGroupById(groupId)
                .then(res => {
                    const { name, direction, curator } = res.data;
                    setFormData({
                        name,
                        direction,
                        curator,
                    });
                    setErrors({});
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [groupId, isEdit]);

    useEffect(() => {
        getAllTeachers()
            .then(res=>setTeachers(res.data))
            .catch(console.error)

        getAllDirections()
            .then(res=>setDirection(res.data))
            .catch(console.error)
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.username = 'Это поле обязательно';
        }

        if (!formData.direction.trim()) {
            newErrors.email = 'Это поле обязательно';
        }

        if (!formData.curator.trim()) {
            newErrors.fullname = 'Это обязательно';
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
                name: formData.name,
                direction: formData.direction,
                curator: formData.curator,
            };


            if (isEdit) {
                await updateGroup(groupId, payload);
            } else {
                await createGroup(payload);
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
                    {isEdit ? 'Обновить группу' : 'Создать новую группу'}
                </h2>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        name="name"
                        placeholder="Название группы"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 mb-3 border rounded ${errors.name ? 'border-red-500' : 'focus:outline-none focus:border-bgSecondary'}`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mb-2">{errors.name}</p>
                    )}

                    <div>
                        <select
                            name="direction"
                            value={formData.direction}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.direction ? 'border-red-500' : 'focus:outline-none focus:border-bgSecondary'}`}
                        >
                            <option value="">Выберите направление</option>
                            {directions.map(dir => (
                                <option key={dir.id} value={dir.id}>
                                    {dir.name}
                                </option>
                            ))}
                        </select>
                        {errors.direction && <p className="text-red-500 text-sm">{errors.direction}</p>}
                    </div>

                    <div>
                        <select
                            name="curator"
                            value={formData.curator}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.curator ? 'border-red-500' : 'focus:outline-none focus:border-bgSecondary'}`}
                        >
                            <option value="">Выберите куратора</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.fullname}
                                </option>
                            ))}
                        </select>
                        {errors.curator && <p className="text-red-500 text-sm">{errors.curator}</p>}
                    </div>

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

export default GroupsForm;
