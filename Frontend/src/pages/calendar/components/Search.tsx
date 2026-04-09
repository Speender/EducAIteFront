import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Event {
    date: string;
    eventType: string;
    title: string;
}

interface Props {
    events: Event[];
    onResultClick: (date: string) => void;
}

const Search = ({ events, onResultClick }: Props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Event[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query, events]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (date: string) => {
        onResultClick(date);
        setQuery('');
        setShowDropdown(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative" 
            ref={dropdownRef}
        >
            <div className="flex items-center bg-black border-[1.5px] border-white/20 rounded-full w-full md:w-[350px] lg:w-[400px] pl-5 pr-1.5 py-1.5 transition-colors focus-within:border-[#00CEC8] shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                {/* Search Icon */}
                <div className="text-white mr-3 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                </div>
                
                <input
                    type="text"
                    placeholder="Search events..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="bg-transparent border-none outline-none text-white w-full text-[1.05rem] placeholder:text-white/40"
                />
                
                <button className="bg-white text-black font-semibold text-sm px-7 py-2.5 rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shrink-0">
                    Search
                </button>
            </div>

            {showDropdown && query && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {results.length > 0 ? (
                        results.map((event, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(event.date)}
                                className="p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-none transition"
                            >
                                <div className="text-white font-medium text-sm">{event.title}</div>
                                <div className="text-zinc-400 text-xs">
                                    {new Date(event.date).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-zinc-500 text-sm">No events found.</div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default Search;