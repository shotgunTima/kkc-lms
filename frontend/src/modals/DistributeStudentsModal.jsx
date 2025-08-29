import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getAllDirections } from "../api/DirectionApi.js";
import { distributeStudents } from "../api/GroupsApi.js";
import { useTranslation } from "react-i18next";
import SelectField from "../components/Inputs/SelectField.jsx";

const DistributeStudentsModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [directions, setDirections] = useState([]);
    const [directionId, setDirectionId] = useState("");
    const [course, setCourse] = useState("");

    useEffect(() => {
        if (isOpen) {
            getAllDirections()
                .then((res) => setDirections(res.data))
                .catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!course || !directionId) return;
        try {
            await distributeStudents(course, directionId);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert(t("error"));
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-bgPrimary/60 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-black-around">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-white">
                    {t("distribute_students")}
                </h2>

                <div className="mt-4 flex flex-col gap-4">
                    <SelectField
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        options={[
                            { value: "", label: t("choose_course") },
                            { value: 1, label: t("course.1") },
                            { value: 2, label: t("course.2") },
                            { value: 3, label: t("course.3") },
                            { value: 4, label: t("course.4") },
                        ]}
                    />

                    <SelectField
                        value={directionId}
                        onChange={(e) => setDirectionId(e.target.value)}
                        options={[
                            { value: "", label: t("choose_direction") },
                            ...directions.map(d => ({ value: d.id, label: d.name }))
                        ]}
                    />

                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-full dark:bg-gray-500 dark:hover:bg-gray-600
                        shadow-soft-gray-around transition-colors duration-300"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-bgSecondary hover:bg-bgSecondary/80 dark:bg-gray-900 dark:hover:bg-gray-900/80 text-white rounded-full
                        shadow-soft-gray-around transition-colors duration-300"
                    >
                        {t("confirm")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DistributeStudentsModal;
