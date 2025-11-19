import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi, TasksQueryParams } from '../api/tasks';
import { CreateTaskDto, UpdateTaskDto } from '../../types/task';

const TASKS_KEY = ['tasks'];

export function useTasks(params?: TasksQueryParams) {
    return useQuery({
        queryKey: params ? [...TASKS_KEY, params] : TASKS_KEY,
        queryFn: () => tasksApi.getAll(params),
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: [...TASKS_KEY, id],
        queryFn: () => tasksApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => tasksApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            tasksApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tasksApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
}
