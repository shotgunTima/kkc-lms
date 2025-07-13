import AnimatedButton from "./AnimatedButton";
import { CirclePlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddButton = ({ onClick, children, ...props }) => {
    const { t } = useTranslation();

    return (
        <AnimatedButton
            icon={CirclePlusIcon}
            onClick={onClick}
            iconAnimation="rotate"
            {...props}
        >
            {children || t("add")}
        </AnimatedButton>
    );
};

export default AddButton;
