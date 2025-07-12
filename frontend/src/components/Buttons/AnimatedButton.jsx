
import clsx from "clsx";

import React from "react";

const AnimatedButton = ({
                            onClick,
                            type = "button",
                            icon: Icon,
                            children,
                            variant = "primary",
                            loading = false,
                            className = "",
                            disabled = false,
                            iconAnimation = "rotate",
                        }) => {
    const variantClass = {
        primary: "bg-bgSecondary text-white hover:bg-opacity-90",
        secondary: "bg-textSecondary text-white hover:bg-red-700",
    };

    const iconClass = {
        rotate: "group-hover:rotate-90",
        spin: "animate-spin",
        none: "",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "group flex items-center justify-start w-12 h-10 rounded-md overflow-hidden transition-all duration-300 hover:w-32 px-3",
                variantClass[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {Icon && (
                <Icon
                    className={clsx(
                        "w-5 h-5 shrink-0 transition-transform duration-300",
                        iconClass[iconAnimation]
                    )}
                />
            )}
            {children && (
                <span className="ml-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {loading ? "Сохранение..." : children}
        </span>
            )}
        </button>
    );
};

export default AnimatedButton;
