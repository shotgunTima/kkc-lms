import { useEffect, useState } from 'react';
import { fetchTeachers } from '../../api/TeachersApi.js';
import SelectField from '../Inputs/SelectField.jsx';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ComponentRow = ({ index, component = {}, onChange, onRemove }) => {
    const { t } = useTranslation();
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers()
            .then(res => setTeachers(res.data || []))
            .catch(err => console.error("Ошибка при получении преподавателей:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(index, { ...component, [name]: value });
    };

    const teacherOptions = (teachers || [])
        .filter(t => t && t.fullname) // только преподаватели с ФИО
        .map(t => ({
            value: t.fullname,          // значение селектора — ФИО
            label: t.fullname           // отображаемое имя — тоже ФИО
        }));

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 items-end mb-2"
        >
            <SelectField
                name="type"
                value={component.type || ''}
                onChange={handleChange}
                label={t('component_type')}
                options={[
                    { value: 'LECTURE', label: t('lecture') },
                    { value: 'PRACTICAL', label: t('practical') },
                    { value: 'LAB', label: t('lab') },
                ]}
            />

            <FloatingLabelInput
                name="hours"
                label={t('hours')}
                type="number"
                value={component.hours || ''}
                onChange={handleChange}
            />

            <SelectField
                name="teacherName"
                value={component.teacherName || ''}
                onChange={handleChange}
                label={t('teachers')}
                options={teacherOptions}
            />

            <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
            >
                × {t('remove')}
            </button>
        </motion.div>
    );
};

export default ComponentRow;
