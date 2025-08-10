import { useTranslation } from 'react-i18next';

const MultipleSelect = ({ id, name, value, onChange, options = [], error, label }) => {
    const { t } = useTranslation();

    return (
        <div className="relative w-full">
            <label
                htmlFor={id}
                className="block mb-1 text-sm font-medium text-textPrimary dark:text-gray-300"
            >
                {label}
            </label>
            <select
                id={id}
                name={name}
                multiple
                value={value}
                onChange={onChange}
                className={`peer w-full px-4 py-2 rounded-md border bg-white text-textPrimary text-opacity-60
          hover:text-textPrimary hover:text-opacity-100
          dark:text-gray-500 dark:hover:text-gray-300 dark:bg-gray-800 dark:border-gray-500 dark:placeholder:text-gray-400
          ${error ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
          focus:outline-none focus:border-bgSecondary`}
                size={options.length > 4 ? 4 : options.length} // показывает 4 элемента по высоте, если больше
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('hold_ctrl_to_select')}
            </p>
        </div>
    );
};

export default MultipleSelect;
