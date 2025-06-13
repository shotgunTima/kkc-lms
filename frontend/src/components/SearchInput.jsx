import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
      <div className="relative flex items-center space-x-2">

        <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md bg-bgSecondary hover:bg-bgPrimary transition"
            aria-label="Открыть поиск"
            type="button"
        >
          <Search className="w-5 h-5 text-white hover:text-blue-200" />
        </button>

        {/* Поле ввода */}
        <div
            className={`
          transition-all duration-300 overflow-hidden
          ${open ? 'w-64 opacity-100 scale-100' : 'w-0 opacity-0 scale-95'}
        `}
        >
          <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onBlur={() => setOpen(false)}
              className=" px-4 py-2 rounded-lg bg-bgSecondary text-white border placeholder:text-white focus:outline-none focus:border-blue-200 focus:shadow-outline-blue "
          />
        </div>
      </div>
  );
};

export default SearchInput;
