
import { Search } from 'lucide-react';
import FloatingLabelInput from "./FloatingLabelInput.jsx";
import { useTranslation } from "react-i18next";

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="relative group flex items-center space-x-2">

            <div className="p-2.5 rounded-full shadow-black-around bg-bgSecondary
            dark:bg-gray-700 ">
                <Search className="w-6 h-6 text-white dark:text-gray-200 " />
            </div>

            <div
                className={`
           transition-all duration-300
          w-0 opacity-0 scale-95 group-hover:w-64 group-hover:opacity-100 group-hover:scale-100
        `}
            >
                <FloatingLabelInput
                    label={placeholder}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default SearchInput;
