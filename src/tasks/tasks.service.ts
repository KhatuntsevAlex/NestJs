import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, type Task } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  #tasks: Task[] = [];
  #getTaskIndexById(id: Task['id']): number {
    const idx = this.#tasks.findIndex((t) => t.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return idx;
  }

  getAllTasks() {
    return this.#tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    const normalizedSearch = search?.trim().toLowerCase();
    if (normalizedSearch) {
      tasks = tasks.filter(
        (t) =>
          t.title.trim().toLowerCase().includes(normalizedSearch) ||
          t.description.trim().toLowerCase().includes(normalizedSearch),
      );
    }

    return tasks;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.#tasks.push(newTask);

    return newTask;
  }

  getTaskById(id: Task['id']): Task {
    const found = this.#tasks.find((t) => t.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  deleteTask(id: Task['id']): Task {
    const taskIndex = this.#getTaskIndexById(id);
    const [deletedTask] = this.#tasks.splice(taskIndex, 1);
    return deletedTask;
  }

  updateTask(id: Task['id'], updateTaskDto: UpdateTaskDto): Task {
    const taskIndex = this.#getTaskIndexById(id);
    const updatedTask: Task = { ...this.#tasks[taskIndex], ...updateTaskDto };
    this.#tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  updateTaskStatus(id: Task['id'], status: TaskStatus): Task {
    return this.updateTask(id, { status });
  }
}
