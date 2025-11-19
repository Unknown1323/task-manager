'use client';

import { ArrowUpDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export type SortOption = 'date' | 'priority' | 'title' | 'created';

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
    darkMode?: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date', label: 'За датою' },
    { value: 'priority', label: 'За пріоритетом' },
    { value: 'title', label: 'За назвою' },
    { value: 'created', label: 'За створенням' },
];

export function SortDropdown({ value, onChange, darkMode = true }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = sortOptions.find((opt) => opt.value === value)?.label || 'Сортування';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    darkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } transition`}
            >
                <ArrowUpDown size={18} />
                <span className="text-sm">{currentLabel}</span>
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                        darkMode ? 'bg-slate-700' : 'bg-white'
                    } border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}
                >
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                                value === option.value
                                    ? darkMode
                                        ? 'bg-slate-600 text-white'
                                        : 'bg-indigo-50 text-indigo-600'
                                    : darkMode
                                    ? 'text-white hover:bg-slate-600'
                                    : 'text-gray-900 hover:bg-gray-100'
                            } first:rounded-t-lg last:rounded-b-lg transition`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
