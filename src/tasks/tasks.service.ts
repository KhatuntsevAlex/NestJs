import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto, GetTasksFilterDto } from './dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: Task['id'], user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async deleteTask(id: Task['id'], user: User): Promise<Task['id']> {
    const results = await this.tasksRepository.delete({ id, user });

    if (results.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return id;
  }

  async updateTaskStatus(
    id: Task['id'],
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
