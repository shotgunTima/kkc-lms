import AnimatedButton from "./AnimatedButton";
import { XCircle } from "lucide-react";

const CancelButton = ({ onClick, ...props }) => {
    return (
        <AnimatedButton
            icon={XCircle}
            onClick={onClick}
            variant="secondary"
            iconAnimation="rotate"
            {...props}
        >
            Отменить
        </AnimatedButton>
    );
};

export default CancelButton;
