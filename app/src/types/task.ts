export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    starred: boolean;
    date?: string;
    time?: string;
    tags: string[];
    priority: TaskPriority;
    attachments: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    completed?: boolean;
    starred?: boolean;
    date?: string;
    time?: string;
    tags?: string[];
    priority?: TaskPriority;
    attachments?: number;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
