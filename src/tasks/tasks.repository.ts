import { Brackets, DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto, GetTasksFilterDto } from './dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private readonly logger = new Logger('TasksRepository', { timestamp: true });

  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = getTasksFilterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    const normalizedSearch = search?.trim().toLowerCase();

    if (normalizedSearch) {
      // query.andWhere(
      //   '(LOWER(TRIM(task.title)) LIKE :search OR LOWER(TRIM(task.description)) LIKE :search)',
      //   { search: `%${normalizedSearch}%` },
      // );
      // or
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(TRIM(task.title)) LIKE :search', {
            search: `%${normalizedSearch}%`,
          }).orWhere('LOWER(TRIM(task.description)) LIKE :search', {
            search: `%${normalizedSearch}%`,
          });
        }),
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve tasks from user "${user.username}". Filters: ${JSON.stringify(getTasksFilterDto)}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return this.save(newTask);
  }
}
