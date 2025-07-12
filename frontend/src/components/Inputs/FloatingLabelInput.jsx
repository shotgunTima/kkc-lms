import { useState } from 'react';

const FloatingLabelInput = ({ id, label, type = 'text', value, name, error, onChange, leftAddon }) => {
    const [isFocused, setIsFocused] = useState(false);
    const shouldFloat = isFocused || value?.toString().length > 0;

    return (
        <div className="relative w-full mb-4">
            <div className="flex">
                {leftAddon}
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`peer w-full px-4 py-2 rounded-md border
                        ${leftAddon ? 'rounded-l-none' : ''}
                        ${error ? 'border-red-500' : 'border-bgSecondary border-opacity-50'}
                        focus:outline-none focus:border-bgSecondary text-textPrimary`}
                />
            </div>
            <label
                htmlFor={id}
                className={`absolute transition-all bg-white rounded-xl px-1 pointer-events-none
                    ${leftAddon ? 'left-16' : 'left-3'} 
                    ${shouldFloat ? 'top-[-0.6rem] text-sm' : 'top-2.5 text-base text-textPrimary opacity-60'}
                    ${error ? 'text-red-500' : 'text-textPrimary'}`}
            >
                {error || label}
            </label>
        </div>
    );
};

export default FloatingLabelInput;
