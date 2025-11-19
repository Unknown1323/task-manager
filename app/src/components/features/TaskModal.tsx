'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, CreateTaskDto } from '@/src/types/task';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateTaskDto) => void;
    task?: Task | null;
}

const AVAILABLE_TAGS = ['Робота', 'Особисте', 'Навчання', 'Термінова', 'Розробка'];

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const [formData, setFormData] = useState<CreateTaskDto>({
        title: '',
        description: '',
        date: '',
        time: '',
        tags: [],
        priority: 'medium',
        attachments: 0,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                date: task.date,
                time: task.time,
                tags: task.tags || [],
                priority: task.priority,
                attachments: task.attachments || 0,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                tags: [],
                priority: 'medium',
                attachments: 0,
            });
        }
    }, [task, isOpen]);

    const handleSubmit = () => {
        if (!formData.title) return;
        onSave(formData);
        onClose();
    };

    const handleAddTag = (tag: string) => {
        if (!formData.tags?.includes(tag)) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) || [] });
    };

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Редагувати задачу' : 'Нова задача'}
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!formData.title}>
                        Зберегти
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <Input
                    label="Назва*"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введіть назву задачі..."
                />

                <Textarea
                    label="Опис"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Додайте опис..."
                    rows={4}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="📅 Дата"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <Input
                        label="🕐 Час"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">🏷️ Теги</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags?.map((tag) => (
                            <span
                                key={tag}
                                className={`px-3 py-1 rounded-full text-sm text-white ${getTagColor(
                                    tag
                                )} flex items-center gap-1`}
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-200"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.filter((tag) => !formData.tags?.includes(tag)).map(
                            (tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleAddTag(tag)}
                                    className="px-3 py-1 rounded-full text-sm transition-colors duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                    + {tag}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <Select
                    label="⭐ Пріоритет"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                    <option value="low">Низький</option>
                    <option value="medium">Середній</option>
                    <option value="high">Високий</option>
                </Select>
            </div>
        </Modal>
    );
}
