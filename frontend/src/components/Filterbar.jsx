import React from 'react';

import {Search} from "lucide-react";

const FilterBar = ({ filters, values, onChange }) => {
    return (
        <div className="flex flex-wrap gap-5 px-4 py-2 rounded-lg">
            {filters.map((filter) => {
                const { name, type, options, placeholder } = filter;
                const value = values[name] || '';

                if (type === 'select') {
                    return (
                        <div key={name} className="flex flex-col">

                            <select
                                value={value}
                                onChange={(e) => onChange(name, e.target.value)}
                                className="px-4 py-2 rounded-lg bg-bgSecondary text-white border focus:outline-none focus:border-blue-200"
                            >
                                {options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                if (type === 'text') {
                    return (
                        <div key={name} className="flex flex-col">
                            <div className="flex items-center bg-bgSecondary rounded-lg px-2">
                                <Search className="w-5 h-5 text-white mr-2" />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => onChange(name, e.target.value)}
                                    placeholder={placeholder}
                                    className="flex-1 bg-bgSecondary text-white px-2 py-2 outline-none"
                                />
                            </div>
                        </div>
                    );
                }

                // можно добавить другие типы (date, checkbox и т.п.)

                return null;
            })}
        </div>
    );
};

export default FilterBar;
