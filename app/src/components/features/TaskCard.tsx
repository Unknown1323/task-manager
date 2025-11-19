'use client';

import { Star, Trash2, Clock, Paperclip, Pencil } from 'lucide-react';
import { Task } from '@/src/types/task';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onToggleStar: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: () => void;
    darkMode: boolean;
}

export function TaskCard({
    task,
    onToggleComplete,
    onToggleStar,
    onDelete,
    onClick,
    darkMode,
}: TaskCardProps) {
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

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Сьогодні';
        if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';

        return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
    };

    return (
        <Card className={task.completed ? 'opacity-60' : ''} darkMode={darkMode}>
            <div className="flex items-start gap-3">
                <Checkbox
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="mt-1"
                />
                <div className="flex-1 min-w-0" onClick={onClick}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                            className={`font-semibold ${task.completed ? 'line-through' : ''} ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleStar(task.id);
                                }}
                                className={`p-1 rounded transition-colors duration-200 ${
                                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                }`}
                                title="Додати в обране"
                            >
                                <Star
                                    size={18}
                                    className={
                                        task.starred
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : darkMode
                                              ? 'text-white'
                                              : 'text-gray-900'
                                    }
                                />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick();
                                }}
                                className={`p-1 rounded transition-colors duration-200 ${
                                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                }`}
                                title="Редагувати"
                            >
                                <Pencil
                                    size={18}
                                    className={darkMode ? 'text-indigo-400' : 'text-indigo-600'}
                                />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                className={`p-1 rounded transition-colors duration-200 ${
                                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                }`}
                                title="Видалити"
                            >
                                <Trash2
                                    size={18}
                                    className={darkMode ? 'text-red-400' : 'text-red-600'}
                                />
                            </button>
                        </div>
                    </div>
                    {task.description && (
                        <p
                            className={`text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}
                        >
                            {task.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        {task.date && (
                            <span
                                className={`flex items-center gap-1 ${
                                    darkMode ? 'text-slate-400' : 'text-gray-500'
                                }`}
                            >
                                <Clock size={14} />
                                {formatDate(task.date)}
                                {task.time && `, ${task.time}`}
                            </span>
                        )}
                        <div className="flex gap-1">
                            {task.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className={`px-2 py-0.5 rounded-full text-xs text-white ${getTagColor(
                                        tag
                                    )}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {task.attachments > 0 && (
                            <span
                                className={`flex items-center gap-1 ${
                                    darkMode ? 'text-slate-400' : 'text-gray-500'
                                }`}
                            >
                                <Paperclip size={14} />
                                {task.attachments}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
