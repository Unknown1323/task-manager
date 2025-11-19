import { Task } from '../../types/task';

export type SortOption = 'date' | 'priority' | 'title' | 'created';

const priorityOrder = { high: 3, medium: 2, low: 1 };

export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
    const sorted = [...tasks];

    switch (sortBy) {
        case 'date':
            return sorted.sort((a, b) => {
                if (!a.date && !b.date) return 0;
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

        case 'priority':
            return sorted.sort((a, b) => {
                const priorityA = priorityOrder[a.priority];
                const priorityB = priorityOrder[b.priority];
                return priorityB - priorityA;
            });

        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title, 'uk'));

        case 'created':
            return sorted.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

        default:
            return sorted;
    }
}
