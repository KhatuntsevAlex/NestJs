import { Injectable } from '@nestjs/common';
import { TaskStatus, type Task } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  #tasks: Task[] = [];
  #getTaskIndexById(id: Task['id']): number {
    return this.#tasks.findIndex((t) => t.id === id);
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

  getTaskById(id: Task['id']): Task | null {
    return this.#tasks.find((t) => t.id === id) ?? null;
  }

  deleteTask(id: Task['id']): Task | null {
    const taskIndex = this.#getTaskIndexById(id);
    if (taskIndex === -1) {
      return null;
    }
    const [deletedTask] = this.#tasks.splice(taskIndex, 1);
    return deletedTask;
  }

  updateTask(id: Task['id'], updateTaskDto: UpdateTaskDto): Task | null {
    const taskIndex = this.#getTaskIndexById(id);
    if (taskIndex === -1) {
      return null;
    }
    const updatedTask: Task = { ...this.#tasks[taskIndex], ...updateTaskDto };
    this.#tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  updateTaskStatus(id: Task['id'], status: TaskStatus): Task | null {
    return this.updateTask(id, { status });
  }
}
