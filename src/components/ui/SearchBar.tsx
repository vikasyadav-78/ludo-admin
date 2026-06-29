import React from 'react';
import { Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={twMerge('relative w-full max-w-sm', className)}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondaryText pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-primaryBg border border-border rounded-lg text-text placeholder-secondaryText outline-none text-sm transition-all duration-200 focus:ring-1 focus:ring-accent focus:border-accent"
      />
    </div>
  );
};
export default SearchBar;
