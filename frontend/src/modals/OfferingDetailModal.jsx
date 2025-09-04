import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchOfferingById } from "../api/CurriculumApi.js";
import { useTranslation } from "react-i18next";

const OfferingDetailsModal = ({ isOpen, onClose, offeringId }) => {
    const { t } = useTranslation();
    const [offering, setOffering] = useState(null);

    useEffect(() => {
        if (isOpen && offeringId) {
            fetchOfferingById(offeringId)
                .then(res => setOffering(res.data))
                .catch(console.error);
        }
    }, [isOpen, offeringId]);

    if (!isOpen) return null;

    const formatField = () => {
        if (!offering) return { components: [] };

        const components = Array.isArray(offering.components)
            ? offering.components
            : Array.isArray(offering.componentAssignments)
                ? offering.componentAssignments
                : [];

        return {
            course: offering.course?.ru || offering.course?.key || offering.course || '–',
            semester: offering.semesterName || '–',
            direction: offering.directionName || '–',
            subjectName: offering.subjectName || '–',
            subjectCode: offering.subjectCode || '–',
            credits: offering.credits || '–',
            totalHours: offering.totalHours || '–',
            capacity: offering.capacity || '–',
            components
        };
    };

    const formatted = formatField();

    return createPortal(
        <div className="fixed inset-0 bg-bgPrimary/60 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-black-around">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-white">
                    {t("offering_details")}
                </h2>

                <div className="mt-4 space-y-2 text-textPrimary dark:text-white">
                    <p><strong>{t("subject")}:</strong> {formatted.subjectName}</p>
                    <p><strong>{t("code")}:</strong> {formatted.subjectCode}</p>
                    <p><strong>{t("credits")}:</strong> {formatted.credits}</p>
                    <p><strong>{t("total_hours")}:</strong> {formatted.totalHours}</p>
                    <p><strong>{t("capacity")}:</strong> {formatted.capacity}</p>
                    <p><strong>{t("courses")}:</strong> {formatted.course}</p>
                    <p><strong>{t("semester")}:</strong> {formatted.semester}</p>
                    <p><strong>{t("direction")}:</strong> {formatted.direction}</p>

                    {formatted.components.length > 0 && (
                        <div className="mt-2">
                            <strong>{t("components")}:</strong>
                            <ul className="list-disc list-inside">
                                {formatted.components.map(c => (
                                    <li key={c.id || c.componentId}>
                                        {c.name || c.type} ({c.hours} {t("hours")})
                                        {c.teacherName ? ` – ${c.teacherName}` : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-full dark:bg-gray-500 dark:hover:bg-gray-600 shadow-soft-gray-around transition-colors duration-300"
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OfferingDetailsModal;
