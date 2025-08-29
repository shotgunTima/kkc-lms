import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { transferStudentToGroup, fetchGroups } from "../api/GroupsApi";
import { fetchStudents } from "../api/StudentApi";
import SelectField from "../components/Inputs/SelectField.jsx";
import { useTranslation } from "react-i18next";

const TransferStudentModal = ({ isOpen, onClose, onSuccess, initialStudentId }) => {
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [studentId, setStudentId] = useState(initialStudentId ?? "");
    const [targetGroupId, setTargetGroupId] = useState("");
    const [force, setForce] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            fetchStudents().then(res => setStudents(res.data)).catch(console.error);
            fetchGroups().then(res => setGroups(res.data)).catch(console.error);
            setStudentId(initialStudentId ?? "");
        }
    }, [isOpen, initialStudentId]);

    const handleTransfer = async () => {
        if (!studentId || !targetGroupId) return;
        try {
            setLoading(true);
            await transferStudentToGroup(studentId, targetGroupId, force);
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error("Transfer failed", err);
            alert(err.response?.data?.error || t("transfer_failed"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-black-around">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-white mb-4">
                    {t("transfer_student")}
                </h2>

                <div className="flex flex-col gap-4">
                    <SelectField
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        options={[
                            { value: "", label: t("choose_student") },
                            ...students.map(s => ({
                                value: s.id,
                                label: s.fullname
                            }))
                        ]}
                        disabled={!!initialStudentId}
                    />

                    <SelectField
                        value={targetGroupId}
                        onChange={(e) => setTargetGroupId(e.target.value)}
                        options={[
                            { value: "", label: t("choose_group") },
                            ...groups.map(g => ({ value: g.id, label: g.name }))
                        ]}
                    />

                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={force}
                            onChange={(e) => setForce(e.target.checked)}
                        />
                        {t("force_transfer")}
                    </label>
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
                        onClick={handleTransfer}
                        disabled={loading}
                        className="px-4 py-2 bg-bgSecondary hover:bg-bgSecondary/80 dark:bg-gray-900 dark:hover:bg-gray-900/80 text-white rounded-full
                        shadow-soft-gray-around transition-colors duration-300"
                    >
                        {loading ? t("transferring") : t("transfer")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TransferStudentModal;
