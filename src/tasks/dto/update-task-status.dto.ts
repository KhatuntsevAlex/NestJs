import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
import { Task } from '../task.entity';

export class UpdateTaskStatusDto implements Pick<Task, 'status'> {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
