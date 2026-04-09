import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskStatusDto } from './dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger = new Logger('TasksController');

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @SerializeOptions({ groups: ['task.short'] })
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['task.detail'] })
  getTaskById(
    @Param('id') id: Task['id'],
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete(':id')
  @SerializeOptions({ groups: ['task.short'] })
  deleteTask(
    @Param('id') id: Task['id'],
    @GetUser() user: User,
  ): Promise<Task['id']> {
    return this.tasksService.deleteTask(id, user);
  }

  @Post()
  @SerializeOptions({ groups: ['task.detail'] })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  @SerializeOptions({ groups: ['task.detail'] })
  updateTaskStatus(
    @Param('id') id: Task['id'],
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
