import { useEffect, useState } from 'react';
import { createDirection, updateDirection, getDirectionById } from '../../api/DirectionApi.js';
import { motion } from 'framer-motion';
import SubmitButton from '../Buttons/SubmitButton.jsx';
import CancelButton from '../Buttons/CancelButton.jsx';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';

const DirectionForm = ({ directionId, onSuccess, onCancel }) => {
    const isEdit = Boolean(directionId);

    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getDirectionById(directionId)
                .then(res => {
                    setFormData({ name: res.data.name || '' });
                    setErrors({});
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [directionId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Это поле обязательно';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = { name: formData.name };
            isEdit
                ? await updateDirection(directionId, payload)
                : await createDirection(payload);
            onSuccess?.();
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 409) {
                setErrors({ name: 'Такое направление уже существует' });
            } else if (data && typeof data === 'object') {
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
            <form onSubmit={handleSubmit} className="mb-40">
                <h2 className="text-xl text-textPrimary mb-5 opacity-70 ">
                    {isEdit ? 'ОБНОВИТЬ НАПРАВЛЕНИЕ' : 'СОЗДАТЬ НАПРАВЛЕНИЕ'}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="name"
                        label="Направление"
                        name="name"
                        value={formData.name}
                        error={errors.name}
                        onChange={handleChange}
                    />

                    <div className="flex items-center gap-4 col-span-2">
                        <SubmitButton isEdit={isEdit} loading={loading} onClick={handleSubmit} />
                        <CancelButton onClick={onCancel} />
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default DirectionForm;
