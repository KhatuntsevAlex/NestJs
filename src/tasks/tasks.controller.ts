import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, TaskStatus } from './task.model';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    }

    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: Task['id']): Task | null {
    const task = this.tasksService.getTaskById(id);

    if (!task) {
      return null;
    }

    return task;
  }

  @Delete(':id')
  deleteTask(@Param('id') id: Task['id']): Task | null {
    const task = this.tasksService.deleteTask(id);

    if (!task) {
      return null;
    }

    return task;
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  updateTask(
    @Param('id') id: Task['id'],
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task | null {
    const task = this.tasksService.updateTask(id, updateTaskDto);

    if (!task) {
      return null;
    }

    return task;
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: Task['id'],
    @Body('status') status: TaskStatus,
  ): Task | null {
    const task = this.tasksService.updateTaskStatus(id, status);

    if (!task) {
      return null;
    }

    return task;
  }
}
