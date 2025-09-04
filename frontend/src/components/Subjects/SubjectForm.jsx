import { useEffect, useState } from 'react';
import { createSubject, fetchSubjectById, updateSubject } from '../../api/SubjectApi.js';
import { motion } from 'framer-motion';
import SubmitButton from '../Buttons/SubmitButton.jsx';
import CancelButton from '../Buttons/CancelButton.jsx';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';
import { useTranslation } from 'react-i18next';
import MultipleSelect from "../Inputs/MultipleSelect.jsx";

const SubjectForm = ({ subjectId, onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const isEdit = Boolean(subjectId);

    const [formData, setFormData] = useState({
        name: '',
        credits: 0,
        code: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);


        if (isEdit) {
            const loadSubject = fetchSubjectById(subjectId).then(res => {
                const { name, credits, teacherIds, code, description } = res.data;
                setFormData({
                    name: name || '',
                    credits: credits || 0,
                    teacherIds: (teacherIds || []).map(Number),
                    code: code || '',
                    description: description || '',
                });
            });

            Promise.all([loadSubject]).finally(() => setLoading(false));
        } else {
                setLoading(false);
                // генерим дефолтный код на фронте
                setFormData(prev => ({ ...prev, code: `SUB-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}` }));
        }
    }, [isEdit, subjectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'credits' ? Number(value) : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('name_required');
        if (formData.credits <= 0) newErrors.credits = t('credits_required');
        if (!formData.code.trim()) newErrors.code = t('code_required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            isEdit
                ? await updateSubject(subjectId, formData)
                : await createSubject(formData);
            onSuccess?.();
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object') setErrors(data);
            else alert(t('submit_error'));
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
                    {isEdit ? t('update_subject') : t('create_subject')}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="name"
                        label={t('name')}
                        name="name"
                        value={formData.name}
                        error={errors.name}
                        onChange={handleChange}
                    />

                    <FloatingLabelInput
                        id="credits"
                        label={t('credits')}
                        name="credits"
                        type="number"
                        value={formData.credits}
                        error={errors.credits}
                        onChange={handleChange}
                    />

                    <FloatingLabelInput
                        id="code"
                        label={t('code')}
                        name="code"
                        value={formData.code}
                        error={errors.code}
                        onChange={handleChange}
                    />

                    <FloatingLabelInput
                        id="description"
                        label={t('description')}
                        name="description"
                        value={formData.description}
                        error={errors.description}
                        onChange={handleChange}
                    />
                    <div className="flex items-center gap-4 col-span-2">
                        <SubmitButton type="submit" isEdit={isEdit} loading={loading} />
                        <CancelButton onClick={onCancel} />
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default SubjectForm;
