
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="relative group flex items-center space-x-2">

            <div className="p-2.5 rounded-md bg-bgSecondary transition group-hover:bg-opacity-80">
                <Search className="w-5 h-5 text-white" />
            </div>

            <div
                className={`
          overflow-hidden transition-all duration-300
          w-0 opacity-0 scale-95 group-hover:w-64 group-hover:opacity-100 group-hover:scale-100
        `}
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="px-4 py-2 rounded-md text-textPrimary border border-bgSecondary border-opacity-50 placeholder:text-textPrimary opacity-70 focus:outline-none focus:border-bgSecondary w-full"
                />
            </div>
        </div>
    );
};

export default SearchInput;
