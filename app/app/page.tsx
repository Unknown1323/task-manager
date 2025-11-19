'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Plus, Moon, Sun, X, Minus, Square } from 'lucide-react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/src/hooks/useTasks';
import { Task } from '@/src/types/task';
import { Button } from '@/src/components/ui/Button';
import { SortDropdown, type SortOption } from '@/src/components/ui/SortDropdown';
import { Sidebar } from '@/src/components/features/Sidebar';
import { TaskList } from '@/src/components/features/TaskList';
import { TaskModal } from '@/src/components/features/TaskModal';
import { sortTasks } from '@/src/utils/sortTasks';

export default function Home() {
    const { setTheme, resolvedTheme } = useTheme();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('created');
    const [mounted, setMounted] = useState(false);

    // Запобігаємо hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Використовуємо resolvedTheme після mount для уникнення hydration mismatch
    const darkMode = mounted ? resolvedTheme === 'dark' : true;

    // Перевірка Electron середовища після mount
    const isElectron = mounted && typeof window !== 'undefined' && !!window.electron;

    const { data: tasks = [], isLoading } = useTasks();

    useEffect(() => {
        if (isElectron) {
            console.log('✅ Running in Electron Desktop App');
            console.log('📱 Platform:', window.electron?.platform);
        } else {
            console.log('🌐 Running in Browser');
        }
    }, [isElectron]);
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        tasks.forEach((task) => task.tags?.forEach((tag) => tagSet.add(tag)));
        return Array.from(tagSet);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        if (selectedFilter === 'starred') {
            filtered = filtered.filter((t) => t.starred);
        } else if (selectedFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter((t) => t.date === today);
        } else if (selectedFilter === 'week') {
            const today = new Date();
            const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter((t) => {
                if (!t.date) return false;
                const taskDate = new Date(t.date);
                return taskDate >= today && taskDate <= weekLater;
            });
        } else if (selectedFilter === 'completed') {
            filtered = filtered.filter((t) => t.completed);
        } else if (selectedFilter.startsWith('tag-')) {
            const tag = selectedFilter.replace('tag-', '');
            filtered = filtered.filter((t) => t.tags?.includes(tag));
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (t) =>
                    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return sortTasks(filtered, sortBy);
    }, [tasks, selectedFilter, searchQuery, sortBy]);

    const handleToggleComplete = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            updateTask.mutate({ id, data: { completed: !task.completed } });
        }
    };

    const handleToggleStar = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            updateTask.mutate({ id, data: { starred: !task.starred } });
        }
    };

    const handleDeleteTask = (id: string) => {
        deleteTask.mutate(id);
    };

    const handleOpenModal = (task?: Task | null) => {
        setEditingTask(task || null);
        setShowModal(true);
    };

    const handleSaveTask = (data: any) => {
        if (editingTask) {
            updateTask.mutate({ id: editingTask.id, data });
        } else {
            createTask.mutate(data);
        }
    };

    const handleMinimize = () => {
        if (window.electron?.window) {
            window.electron.window.minimize();
        }
    };

    const handleMaximize = () => {
        if (window.electron?.window) {
            window.electron.window.maximize();
        }
    };

    const handleClose = () => {
        if (window.electron?.window) {
            window.electron.window.close();
        }
    };

    return (
        <div
            className={`h-screen flex flex-col ${
                darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'
            }`}
        >
            <div
                className={`flex items-center justify-between py-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                } border-b ${isElectron ? 'pl-20 pr-4' : 'px-4'}`}
                style={
                    isElectron ? ({ WebkitAppRegion: 'drag' } as React.CSSProperties) : undefined
                }
            >
                <div
                    className="flex items-center gap-3"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <div className="text-2xl">📋</div>
                    <span className="font-semibold">Task Manager</span>
                    {!isElectron && <span className="text-xs opacity-50 ml-2">Web Version</span>}
                </div>
                {isElectron && (
                    <div
                        className="flex items-center gap-1"
                        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                    >
                        <button
                            onClick={handleMinimize}
                            className={`p-1.5 hover:${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded transition-colors`}
                            title="Згорнути"
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            onClick={handleMaximize}
                            className={`p-1.5 hover:${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded transition-colors`}
                            title="Розгорнути"
                        >
                            <Square size={14} />
                        </button>
                        <button
                            onClick={handleClose}
                            className={`p-1.5 hover:bg-red-500 hover:text-white rounded transition-colors`}
                            title="Закрити"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    tags={allTags}
                    darkMode={darkMode}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div
                        className={`p-4 ${
                            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                        } border-b flex items-center gap-3`}
                    >
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Пошук задач..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                                    darkMode
                                        ? 'bg-slate-700 text-white placeholder-slate-400'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                        <SortDropdown value={sortBy} onChange={setSortBy} darkMode={darkMode} />
                        <Button onClick={() => handleOpenModal()}>
                            <Plus size={20} />
                            <span>Додати</span>
                        </Button>
                        <button
                            onClick={() => setTheme(darkMode ? 'light' : 'dark')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                darkMode
                                    ? 'bg-slate-700 hover:bg-slate-600'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-4xl mx-auto">
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <p
                                        className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}
                                    >
                                        Завантаження...
                                    </p>
                                </div>
                            ) : (
                                <TaskList
                                    tasks={filteredTasks}
                                    onToggleComplete={handleToggleComplete}
                                    onToggleStar={handleToggleStar}
                                    onDelete={handleDeleteTask}
                                    onTaskClick={handleOpenModal}
                                    darkMode={darkMode}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingTask(null);
                }}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </div>
    );
}
