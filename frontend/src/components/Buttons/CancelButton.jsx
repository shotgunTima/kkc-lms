import AnimatedButton from "./AnimatedButton";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";



const CancelButton = ({ onClick, ...props }) => {
    const { t } = useTranslation();
    return (
        <AnimatedButton
            icon={X}
            onClick={onClick}
            variant="secondary"
            iconAnimation="rotate"
            {...props}
        >
            {t("cancel")}
        </AnimatedButton>
    );
};

export default CancelButton;
