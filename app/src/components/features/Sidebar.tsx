'use client';

import { CheckSquare, Star, Calendar } from 'lucide-react';

type FilterType = 'all' | 'starred' | 'today' | 'week' | 'completed' | string;

interface SidebarProps {
    selectedFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    tags: string[];
    darkMode: boolean;
}

export function Sidebar({ selectedFilter, onFilterChange, tags, darkMode }: SidebarProps) {
    const getTagColor = (tag: string) => {
        const colors: Record<string, string> = {
            Робота: 'bg-blue-500',
            Особисте: 'bg-green-500',
            Навчання: 'bg-purple-500',
            Термінова: 'bg-red-500',
            Розробка: 'bg-indigo-500',
        };
        return colors[tag] || 'bg-gray-500';
    };

    const buttonClass = (filter: string) =>
        `w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
            selectedFilter === filter
                ? darkMode
                    ? 'bg-slate-700 text-white'
                    : 'bg-indigo-50 text-indigo-600'
                : darkMode
                ? 'hover:bg-slate-700'
                : 'hover:bg-gray-100'
        }`;

    return (
        <div
            className={`w-60 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            } border-r flex flex-col`}
        >
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                <button onClick={() => onFilterChange('all')} className={buttonClass('all')}>
                    <CheckSquare size={18} />
                    <span>Всі задачі</span>
                </button>
                <button onClick={() => onFilterChange('starred')} className={buttonClass('starred')}>
                    <Star size={18} />
                    <span>Важливі</span>
                </button>
                <button onClick={() => onFilterChange('today')} className={buttonClass('today')}>
                    <Calendar size={18} />
                    <span>Сьогодні</span>
                </button>
                <button onClick={() => onFilterChange('week')} className={buttonClass('week')}>
                    <Calendar size={18} />
                    <span>Тиждень</span>
                </button>
                <button onClick={() => onFilterChange('completed')} className={buttonClass('completed')}>
                    ✅ <span>Завершені</span>
                </button>

                <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        🏷️ Теги
                    </div>
                    {tags.length > 0 && (
                        <button
                            onClick={() => onFilterChange('all')}
                            className={`${buttonClass('all')} mb-2`}
                        >
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span>Всі теги</span>
                        </button>
                    )}
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onFilterChange(`tag-${tag}`)}
                            className={buttonClass(`tag-${tag}`)}
                        >
                            <span className={`w-2 h-2 rounded-full ${getTagColor(tag)}`}></span>
                            <span>{tag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
