
import AnimatedButton from "./AnimatedButton";
import { CirclePlusIcon } from "lucide-react";

const AddButton = ({ onClick, children = "Добавить", ...props }) => {
    return (
        <AnimatedButton
            icon={CirclePlusIcon}
            onClick={onClick}
            iconAnimation="rotate"
            {...props}
        >
            {children}
        </AnimatedButton>
    );
};

export default AddButton;
