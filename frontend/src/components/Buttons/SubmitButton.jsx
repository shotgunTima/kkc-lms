import AnimatedButton from "./AnimatedButton";
import { Check, Save } from "lucide-react";

const SubmitButton = ({ isEdit = false, loading = false, ...props }) => {
    const Icon = loading ? Save : Check;
    const text = loading ? "Сохранение..." :  "Сохранить";

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
