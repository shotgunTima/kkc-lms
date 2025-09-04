
import SelectField from '../Inputs/SelectField.jsx';
import FloatingLabelInput from '../Inputs/FloatingLabelInput.jsx';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {useEffect, useState} from "react";
import {fetchTeachers} from "../../api/TeachersApi.js";
import {fetchGroups} from "../../api/GroupsApi.js";

const ComponentRow = ({ index, component = {}, onChange, onRemove }) => {
    const { t } = useTranslation();
    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchTeachers()
            .then(res => setTeachers(res.data || []))
            .catch(console.error);

        fetchGroups()
            .then(res => setGroups(res.data || [])) // <-- здесь правильный setGroups
            .catch(console.error);
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(index, { ...component, [name]: value });
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 items-end mb-2"
        >
            <SelectField
                name="type"
                label={t('component_type')}
                value={component.type || ''}
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
                name="groupId"
                value={component.groupId || ''}
                onChange={e => handleChange({ target: { name: 'groupId', value: e.target.value } })}
                options={[{ value: '', label: t('choose_group') }, ...groups.map(g => ({ value: g.id, label: g.name }))]}
            />

            <SelectField
                name="teacherId"
                value={component.teacherId || ''}
                onChange={(e) => handleChange({ target: { name: 'teacherId', value: e.target.value } })}
                options={[
                    { value: '', label: t('select_teacher') },
                    ...(teachers || []).map(teacher => ({ value: teacher.id, label: teacher.fullname }))
                ]}

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
