import { useEffect, useState } from "react";
import { createSemester, updateSemester, fetchSemesterById } from "../../api/SemesterApi.js";
import { motion } from "framer-motion";
import SubmitButton from "../Buttons/SubmitButton.jsx";
import CancelButton from "../Buttons/CancelButton.jsx";
import FloatingLabelInput from "../Inputs/FloatingLabelInput.jsx";
import SelectField from "../Inputs/SelectField.jsx";
import { useTranslation } from "react-i18next";

const terms = ["SPRING", "SUMMER", "FALL", "WINTER"];

const SemesterForm = ({ semesterId, onSuccess, onCancel }) => {
    const isEdit = Boolean(semesterId);
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        term: "SPRING",
        year: new Date().getFullYear(),
        startDate: Date.now(),
        endDate: Date.now(),
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const terms = ["SPRING", "SUMMER", "FALL", "WINTER"];
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            fetchSemesterById(semesterId)
                .then(res => setFormData(res.data))
                .catch(err => console.error("Ошибка при загрузке семестра:", err))
                .finally(() => setLoading(false));
        }
    }, [isEdit, semesterId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t("name_required");
        if (!formData.term) newErrors.term = t("term_required");
        if (!formData.year || formData.year < 2000) newErrors.year = t("year_required");
        if (!formData.startDate) newErrors.startDate = t("start_date_required");
        if (!formData.endDate) newErrors.endDate = t("end_date_required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            if (isEdit) {
                await updateSemester(semesterId, formData);
            } else {
                await createSemester(formData);
            }
            onSuccess?.();
        } catch (err) {
            console.error("Ошибка при сохранении семестра:", err);
            const data = err.response?.data;
            if (data && typeof data === "object") setErrors(data);
            else alert("Ошибка при отправке данных");
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
            <form onSubmit={handleSubmit} className="mb-20">
                <h2 className="text-xl text-textPrimary mb-5 opacity-70 dark:text-blue-200">
                    {isEdit ? t("edit_semester") : t("create_semester")}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        id="name"
                        label={t("name")}
                        name="name"
                        value={formData.name}
                        error={errors.name}
                        onChange={handleChange}
                    />

                    <SelectField
                        id="term"
                        name="term"
                        value={formData.term}
                        onChange={handleChange}
                        options={terms.map(term => ({
                            value: term,
                            // перевод через отдельный key "terms"
                            label: t(`terms.${term.toLowerCase()}`) || term
                        }))}
                        error={errors.term}
                    />

                    <FloatingLabelInput
                        id="year"
                        label={t("year")}
                        name="year"
                        type="number"
                        value={formData.year}
                        error={errors.year}
                        onChange={handleChange}
                    />

                    <FloatingLabelInput
                        id="startDate"
                        label={t("start_date")}
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        error={errors.startDate}
                        onChange={handleChange}
                    />

                    <FloatingLabelInput
                        id="endDate"
                        label={t("end_date")}
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        error={errors.endDate}
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

export default SemesterForm;
