import { Task, CreateTaskDto, UpdateTaskDto } from '../../types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface TasksQueryParams {
    filter?: string;
    tag?: string;
    search?: string;
    sortBy?: 'date' | 'priority' | 'title' | 'created';
}

export const tasksApi = {
    async getAll(params?: TasksQueryParams): Promise<Task[]> {
        const queryParams = new URLSearchParams();
        if (params?.filter) queryParams.append('filter', params.filter);
        if (params?.tag) queryParams.append('tag', params.tag);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

        const url = `${API_URL}/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async getById(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    async create(data: CreateTaskDto): Promise<Task> {
        console.log(data);
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    async update(id: string, data: UpdateTaskDto): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },
};
