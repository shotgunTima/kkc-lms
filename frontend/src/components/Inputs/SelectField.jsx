import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const SelectField = ({ id, name, value, onChange, options = [], error, label }) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block mb-1 text-sm font-medium text-textPrimary dark:text-gray-300"
                >
                    {label}
                </label>
            )}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    w-full px-4 py-2 rounded-md border bg-white
                    ${value || isFocused ? 'text-textPrimary text-opacity-100' : 'text-textPrimary text-opacity-60'}
                    hover:text-textPrimary hover:text-opacity-100
                    dark:bg-gray-800 dark:border-gray-500 dark:text-gray-300 dark:hover:text-gray-100
                    ${error ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                    focus:outline-none focus:border-bgSecondary
                    transition-colors duration-150
                `}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default SelectField;
