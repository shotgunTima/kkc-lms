import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchGroups, assignCuratorsBulk } from "../api/GroupsApi.js";
import { fetchTeachers } from "../api/TeachersApi.js";
import { useTranslation } from "react-i18next";
import SelectField from "../components/Inputs/SelectField.jsx";

const AssignCuratorsBulkModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        if (isOpen) {
            Promise.all([fetchGroups(), fetchTeachers()])
                .then(([grRes, tchRes]) => {
                    setGroups(grRes.data);
                    setTeachers(tchRes.data);
                    setAssignments(grRes.data.map(g => ({ groupId: g.id, curatorId: "" })));
                })
                .catch(console.error);
        }
    }, [isOpen]);

    const handleChange = (groupId, curatorId) => {
        setAssignments(prev => prev.map(a => a.groupId === groupId ? { ...a, curatorId } : a));
    };

    const handleSubmit = async () => {
        try {
            await assignCuratorsBulk(assignments);
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-black-around">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-white">
                    {t("assign_curators_bulk")}
                </h2>

                <div className="mt-4 flex flex-col gap-3 max-h-96 overflow-auto">
                    {groups.map(g => (
                        <div key={g.id} className="flex flex-col justify-between items-start gap-1">
                            <span className="text-textPrimary dark:text-white mt-2">{g.name}</span>
                            <SelectField
                                value={assignments.find(a => a.groupId === g.id)?.curatorId || ""}
                                onChange={e => handleChange(g.id, e.target.value)}
                                options={[
                                    { value: "", label: t("choose_curator") },
                                    ...teachers.map(tch => ({ value: tch.id, label: tch.fullname }))
                                ]}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-full dark:bg-gray-500 dark:hover:bg-gray-600 shadow-soft-gray-around transition-colors duration-300"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-bgSecondary hover:bg-bgSecondary/80 dark:bg-gray-900 dark:hover:bg-gray-900/80 text-white rounded-full shadow-soft-gray-around transition-colors duration-300"
                    >
                        {t("confirm")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignCuratorsBulkModal;
