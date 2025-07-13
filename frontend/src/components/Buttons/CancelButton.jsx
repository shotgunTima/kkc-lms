import AnimatedButton from "./AnimatedButton";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";



const CancelButton = ({ onClick, ...props }) => {
    const { t } = useTranslation();
    return (
        <AnimatedButton
            icon={XCircle}
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
