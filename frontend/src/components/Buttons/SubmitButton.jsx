import AnimatedButton from "./AnimatedButton";
import { Check, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

const SubmitButton = ({ isEdit = false, loading = false, ...props }) => {
    const { t } = useTranslation();
    const Icon = loading ? Save : Check;
    const text = loading ? t("saving") : t("save");

    return (
        <AnimatedButton
            type="submit"
            icon={Icon}
            loading={loading}
            iconAnimation={loading ? "spin" : "none"}
            {...props}
        >
            {text}
        </AnimatedButton>
    );
};

export default SubmitButton;
