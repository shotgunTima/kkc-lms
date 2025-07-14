
import React from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title = "Вы уверены?", description = "", confirmText = "Да", cancelText = "Отмена" }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-black-around">
                <h2 className="text-lg font-semibold text-textPrimary dark:text-white">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                )}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-full dark:bg-gray-500 dark:hover:bg-gray-600
                        shadow-soft-gray-around transition-colors duration-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full
                        shadow-soft-gray-around transition-colors duration-300"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
