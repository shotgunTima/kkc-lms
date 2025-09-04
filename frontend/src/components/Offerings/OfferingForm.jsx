import { useEffect, useState } from 'react';
import { fetchSubjects } from '../../api/SubjectApi.js';
import { fetchSemesters } from '../../api/SemesterApi.js';
import { getAllDirections } from '../../api/DirectionApi.js';
import { createOffering, fetchOfferingById, updateOffering } from '../../api/CurriculumApi.js';
import { motion } from 'framer-motion';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';
import SelectField from '../Inputs/SelectField.jsx';
import ComponentRow from './ComponentRow.jsx';
import SubmitButton from '../Buttons/SubmitButton.jsx';
import CancelButton from '../Buttons/CancelButton.jsx';
import { useTranslation } from 'react-i18next';
import {fetchTeachers} from "../../api/TeachersApi.js";

const OfferingForm = ({ offeringId, onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const isEdit = Boolean(offeringId);

    const [courseOptions, setCourseOptions] = useState([
        { value: '1', label: t('FIRST') },
        { value: '2', label: t('SECOND') },
        { value: '3', label: t('THIRD') },
        { value: '4', label: t('FOURTH') },
    ]);

    const [formData, setFormData] = useState({
        subjectId: '',
        semesterId: '',
        directionId: '',
        course: '1',
        totalHours: '',
        teacherId: '',
        capacity: '',
        components: []
    });

    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [directions, setDirections] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubjects().then(res => setSubjects(res.data || [])).catch(console.error);
        fetchSemesters().then(res => setSemesters(res.data || [])).catch(console.error);
        getAllDirections().then(res => setDirections(res.data || [])).catch(console.error);

        if (isEdit) {
            setLoading(true);
            fetchOfferingById(offeringId)
                .then(res => {
                    const data = res.data || {};
                    const components = Array.isArray(data.componentAssignments) && data.componentAssignments.length > 0
                        ? data.componentAssignments.map(ca => ({
                            id: ca.componentId,
                            type: ca.type || '',
                            hours: ca.hours || '',
                            teacherId: ca.teacherId ?? null,
                        }))
                        : [{ type: 'LECTURE', hours: '', teacherId: '', teacherName: '' }];

                    setFormData({
                        subjectId: data.subjectId || '',
                        semesterId: data.semesterId || '',
                        directionId: data.directionId || '',
                        course: data.course
                            ? { 'FIRST': '1', 'SECOND': '2', 'THIRD': '3', 'FOURTH': '4' }[data.course] || '1'
                            : '1',
                        totalHours: data.totalHours || '',
                        capacity: data.capacity || '',
                        components
                    });
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [offeringId, isEdit]);

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers()
            .then(res => setTeachers(res.data || []))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleComponentChange = (index, updatedComponent) => {
        setFormData(prev => {
            const components = [...prev.components];
            components[index] = updatedComponent;
            return { ...prev, components };
        });
    };

    const handleAddComponent = () => {
        setFormData(prev => ({
            ...prev,
            components: [...prev.components, { type: 'LECTURE', hours: '', teacherId: '' }]
        }));
    };

    const handleRemoveComponent = (index) => {
        setFormData(prev => {
            const components = [...prev.components];
            components.splice(index, 1);
            return { ...prev, components };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subjectId) newErrors.subjectId = t('select_subject');
        if (!formData.semesterId) newErrors.semesterId = t('select_semester');
        if (!formData.directionId) newErrors.directionId = t('select_direction');
        if (!formData.course) newErrors.course = t('course_required');
        if (!formData.totalHours || Number(formData.totalHours) <= 0) newErrors.totalHours = t('total_hours_required');
        if (!formData.capacity || Number(formData.capacity) <= 0) newErrors.capacity = t('capacity_required');
        // Проверка компонентов
        if (Array.isArray(formData.components)) {
            formData.components.forEach((component, idx) => {
                if (!component.type) newErrors[`components.${idx}.type`] = t('component_type_required');
                if (!component.hours || Number(component.hours) <= 0) newErrors[`components.${idx}.hours`] = t('component_hours_required');
                if (!component.teacherId && !component.groupId) newErrors[`components.${idx}.teacherId`] = t('component_teacher_required');
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                components: formData.components.map(c => ({
                    type: c.type,
                    hours: Number(c.hours),
                    teacherId: c.teacherId ? Number(c.teacherId) : null,
                    groupId: c.groupId ? Number(c.groupId) : null,
                }))
            };

            if (isEdit) await updateOffering(offeringId, payload);
            else await createOffering(payload);
            onSuccess?.();
        } catch (err) {
            console.error(err);
            alert(t('submit_error'));
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
                <h2 className="text-xl mb-5 opacity-70 dark:text-blue-200">
                    {isEdit ? t('update_offering') : t('create_offering')}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        id="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        options={[{ value: '', label: t('select_subject') }, ...subjects.map(s => ({ value: s.id, label: s.name }))]}
                        error={errors.subjectId}
                    />

                    <SelectField
                        id="semesterId"
                        name="semesterId"
                        value={formData.semesterId}
                        onChange={handleChange}
                        options={[{ value: '', label: t('select_semester') }, ...semesters.map(s => ({ value: s.id, label: s.name }))]}
                        error={errors.semesterId}
                    />

                    <SelectField
                        id="directionId"
                        name="directionId"
                        value={formData.directionId}
                        onChange={handleChange}
                        options={[{ value: '', label: t('select_direction') }, ...directions.map(d => ({ value: d.id, label: d.name }))]}
                        error={errors.directionId}
                    />

                    <SelectField
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        options={courseOptions}
                        error={errors.course}
                    />

                    <FloatingLabelInput
                        id="totalHours"
                        label={t('total_hours')}
                        type="number"
                        name="totalHours"
                        value={formData.totalHours}
                        onChange={handleChange}
                        error={errors.totalHours}
                    />

                    <FloatingLabelInput
                        id="capacity"
                        label={t('capacity')}
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        error={errors.capacity}
                    />

                    <div className="col-span-2">
                        <h3 className="mb-2 text-lg">{t('components')}</h3>
                        {formData.components.map((comp, idx) => (
                            <ComponentRow
                                key={idx}
                                index={idx}
                                component={comp}
                                onChange={handleComponentChange}
                                onRemove={handleRemoveComponent}
                            />
                        ))}
                        <button type="button" onClick={handleAddComponent} className="mt-2 text-blue-600 hover:underline">
                            + {t('add_component')}
                        </button>
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

export default OfferingForm;
