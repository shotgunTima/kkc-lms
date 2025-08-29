import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchGroups, assignCurator } from "../api/GroupsApi.js";
import { fetchTeachers } from "../api/TeachersApi.js";
import { useTranslation } from "react-i18next";
import SelectField from "../components/Inputs/SelectField.jsx";

const AssignCuratorModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [curatorId, setCuratorId] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchGroups().then(res => setGroups(res.data)).catch(console.error);
            fetchTeachers().then(res => setTeachers(res.data)).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!groupId || !curatorId) return;
        try {
            await assignCurator(groupId, curatorId);
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
                    {t("assign_curator")}
                </h2>

                <div className="mt-4 flex flex-col gap-4">
                    <SelectField
                        value={groupId}
                        onChange={e => setGroupId(e.target.value)}
                        options={[
                            { value: "", label: t("choose_group") },
                            ...groups.map(g => ({ value: g.id, label: g.name }))
                        ]}
                        label={t("group")}
                    />

                    <SelectField
                        value={curatorId}
                        onChange={e => setCuratorId(e.target.value)}
                        options={[
                            { value: "", label: t("choose_curator") },
                            ...teachers.map(tch => ({ value: tch.id, label: tch.fullname }))
                        ]}
                        label={t("curator")}
                    />
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

export default AssignCuratorModal;
