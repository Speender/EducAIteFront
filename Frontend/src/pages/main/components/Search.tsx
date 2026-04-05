import React, { useState, useMemo, useRef, useEffect } from 'react';

interface SearchItem {
    id: number;
    title: string;
    scope: 'courses' | 'resume' | 'flashcards' | 'calendar events' | 'grades';
    path: string;
}

const mockData: SearchItem[] = [
    { id: 1, title: "Advanced React Patterns", scope: "courses", path: "/courses/react-patterns" },
    { id: 2, title: "Frontend Developer Resume 2024", scope: "resume", path: "/resume/edit/1" },
    { id: 3, title: "Data Structures & Algorithms", scope: "flashcards", path: "/flashcards/dsa" },
    { id: 4, title: "Final Exam - Physics", scope: "calendar events", path: "/calendar?event=4" },
    { id: 5, title: "Introduction to Psychology", scope: "grades", path: "/grades/psych-101" },
];


const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];
        return mockData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const handleSelectResult = (item: SearchItem) => {
        console.log(`Navigating to: ${item.path}`);

        setQuery(item.title);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getScopeColor = (scope: string) => {
        const colors: Record<string, string> = {
            courses: 'text-blue-400 bg-blue-400/10',
            resume: 'text-emerald-400 bg-emerald-400/10',
            flashcards: 'text-purple-400 bg-purple-400/10',
            'calendar events': 'text-amber-400 bg-amber-400/10',
            grades: 'text-rose-400 bg-rose-400/10',
        };
        return colors[scope] || 'text-gray-400 bg-gray-400/10';
    };

    return (
        <div ref={wrapperRef} className="w-full max-w-[700px] relative">
            <div className="w-full bg-[#111111] border border-white/10 rounded-full flex items-center px-6 py-3 gap-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] focus-within:border-[#00CEC8]/50 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search a course, topic, or material..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-base"
                />
                <button className="bg-white text-black rounded-full px-8 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95">
                    Search
                </button>
            </div>

            {isOpen && query.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#161616] border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl backdrop-blur-xl">
                    {filteredResults.length > 0 ? (
                        <div className="py-2">
                            {filteredResults.map((item) => (
                                <button
                                    key={item.id}
                                    className="w-full px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                    onClick={() => handleSelectResult(item)}
                                >
                                    <span className="text-white/90 font-medium">{item.title}</span>
                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${getScopeColor(item.scope)}`}>
                                        {item.scope}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center text-white/40 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;