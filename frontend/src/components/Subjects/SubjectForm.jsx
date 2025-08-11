import { useEffect, useState } from 'react';
import {
    createSubject,
    fetchSubjectById,
    updateSubject
} from '../../api/SubjectApi.js';
import { fetchTeachers } from '../../api/TeachersApi.js';
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
        teacherIds: []
    });

    const [teachersOptions, setTeachersOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const loadTeachers = fetchTeachers()
            .then(res => {
                const options = res.data.map(teacher => ({
                    value: Number(teacher.id),
                    label: teacher.fullname,
                }));
                setTeachersOptions(options);
            });

        if (isEdit) {
            const loadSubject = fetchSubjectById(subjectId)
                .then(res => {
                    const { name, credits, teacherIds } = res.data;
                    setFormData({
                        name: name || '',
                        credits: credits || 0,
                        teacherIds: (teacherIds || []).map(Number)
                    });
                });

            Promise.all([loadTeachers, loadSubject])
                .finally(() => setLoading(false));
        } else {
            loadTeachers.finally(() => setLoading(false));
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
        if (formData.teacherIds.length === 0) newErrors.teacherIds = t('teachers_required');
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
                    <MultipleSelect

                        id="teacherIds"
                        name="teacherIds"
                        label={t('teacher_s')}
                        options={teachersOptions}
                        value={formData.teacherIds}
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                            setFormData(prev => ({ ...prev, teacherIds: selected }));
                        }}
                        error={errors.teacherIds}
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
