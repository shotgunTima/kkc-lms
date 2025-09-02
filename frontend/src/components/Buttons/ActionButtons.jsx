
import { PencilLine, Eraser, Eye } from "lucide-react";

const ActionButtons = ({ onEdit, onDelete, onView, viewTitle ="Просмотр", editTitle = "Изменить", deleteTitle = "Удалить" }) => {
    return (
        <div className="flex justify-center gap-4">
            <PencilLine
                title={editTitle}
                className="w-6 h-6 text-textPrimary hover:text-blue-500 cursor-pointer transition-colors
                    dark:text-blue-500 dark:hover:text-blue-400"
                onClick={onEdit}
            />
            <Eraser
                title={deleteTitle}
                className="w-6 h-6 text-textSecondary hover:text-red-500 cursor-pointer transition-colors
                    dark:text-red-500 dark:hover:text-red-400"
                onClick={onDelete}
            />
            <Eye
                title={viewTitle}
                className="w-6 h-6 text-gray hover:text-gray-500 cursor-pointer transition-colors
                    dark:text-gray-500 dark:hover:text-blue-400"
                onClick={onView}
            />
        </div>
    );
};

export default ActionButtons;
