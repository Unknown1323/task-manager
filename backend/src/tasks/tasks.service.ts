import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async findAll(
    filter?: string,
    tag?: string,
    search?: string,
    sortBy: 'date' | 'priority' | 'title' | 'created' = 'created',
  ): Promise<Task[]> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task');

    this.applyFilters(queryBuilder, filter);

    if (tag) {
      this.applyTagFilter(queryBuilder, tag);
    }

    if (search) {
      this.applySearch(queryBuilder, search);
    }

    this.applySorting(queryBuilder, sortBy);

    return await queryBuilder.getMany();
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Task>,
    filter?: string,
  ): void {
    switch (filter) {
      case 'starred':
        queryBuilder.where('task.starred = :starred', { starred: true });
        break;

      case 'today':
        const today = this.getTodayDate();
        queryBuilder.where('task.date = :today', { today });
        break;

      case 'week':
        const { today: weekStart, weekLater } = this.getWeekRange();
        queryBuilder.where('task.date >= :today AND task.date <= :weekLater', {
          today: weekStart,
          weekLater,
        });
        break;

      case 'completed':
        queryBuilder.where('task.completed = :completed', { completed: true });
        break;
    }
  }

  private applyTagFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    tag: string,
  ): void {
    queryBuilder.andWhere(':tag = ANY(task.tags)', { tag });
  }

  private applySearch(
    queryBuilder: SelectQueryBuilder<Task>,
    search: string,
  ): void {
    queryBuilder.andWhere(
      '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
      { search: `%${search}%` },
    );
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<Task>,
    sortBy: 'date' | 'priority' | 'title' | 'created',
  ): void {
    switch (sortBy) {
      case 'date':
        queryBuilder.orderBy('task.date', 'ASC', 'NULLS LAST');
        break;

      case 'priority':
        // Сортування: high -> medium -> low
        queryBuilder.orderBy(
          `CASE task.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`,
          'ASC',
        );
        break;

      case 'title':
        queryBuilder.orderBy('task.title', 'ASC');
        break;

      case 'created':
      default:
        queryBuilder.orderBy('task.createdAt', 'DESC');
        break;
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getWeekRange(): { today: string; weekLater: string } {
    const today = this.getTodayDate();
    const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return { today, weekLater };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    Object.assign(task, updateTaskDto);

    return await this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
