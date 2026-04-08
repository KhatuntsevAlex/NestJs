import { IsEnum } from 'class-validator';
import { Task, TaskStatus } from '../task.model';

export class UpdateTaskStatusDto implements Pick<Task, 'status'> {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
