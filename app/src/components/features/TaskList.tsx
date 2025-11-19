'use client';

import { Task } from '@/src/types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onToggleStar: (id: string) => void;
    onDelete: (id: string) => void;
    onTaskClick: (task: Task) => void;
    darkMode: boolean;
}

export function TaskList({
    tasks,
    onToggleComplete,
    onToggleStar,
    onDelete,
    onTaskClick,
    darkMode,
}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Немає задач
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onToggleStar={onToggleStar}
                    onDelete={onDelete}
                    onClick={() => onTaskClick(task)}
                    darkMode={darkMode}
                />
            ))}
        </div>
    );
}
