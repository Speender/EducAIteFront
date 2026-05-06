import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Filter records...' }: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <SearchIcon className="h-4 w-4 text-white/10 transition-colors group-focus-within:text-primary/50" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border-white/[0.03] bg-white/[0.02] pl-12 pr-6 text-sm font-medium tracking-tight text-white placeholder:text-white/10 focus-visible:border-primary/20 focus-visible:ring-primary/5 transition-all"
      />
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/5 opacity-0 group-focus-within:opacity-100 transition-opacity">
          Active_Filter
        </span>
      </div>
    </div>
  );
}

export default SearchBar;
