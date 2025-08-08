
import clsx from "clsx";
import { useTranslation } from "react-i18next";
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
        primary: "bg-bgSecondary text-white shadow-black-around hover:bg-opacity-90 dark:bg-gray-900 dark:hover:bg-gray-700",
        secondary: "bg-textSecondary text-white shadow-black-around hover:bg-red-700 dark:bg-red-850 dark:hover:bg-red-750 dark:text-gray-200",
    };

    const iconClass = {
        rotate: "group-hover:rotate-90",
        spin: "animate-spin",
        none: "",
    };
    const { t } = useTranslation();
    return (

        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "group flex items-center justify-start w-12 h-11 rounded-lg overflow-hidden transition-all duration-300 hover:w-32 px-3",
                variantClass[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {Icon && (
                <Icon
                    className={clsx(
                        "w-6 h-7 shrink-0 transition-transform duration-300",
                        iconClass[iconAnimation]
                    )}
                />
            )}
            {children && (
                <span className="ml-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {loading ? t("saving") : children}
        </span>
            )}
        </button>
    );
};

export default AnimatedButton;
