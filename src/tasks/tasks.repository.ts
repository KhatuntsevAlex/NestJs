import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto, GetTasksFilterDto } from './dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks({ status, search }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    const normalizedSearch = search?.trim().toLowerCase();

    if (normalizedSearch) {
      query.andWhere(
        'LOWER(TRIM(task.title)) LIKE :search OR LOWER(TRIM(task.description)) LIKE :search',
        { search: `%${normalizedSearch}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return this.save(newTask);
  }
}
