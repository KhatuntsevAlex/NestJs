import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Task, TaskStatus } from '../task.model';

export class UpdateTaskDto implements Partial<
  Pick<Task, 'title' | 'description' | 'status'>
> {
  @IsOptional()
  @IsString()
  title?: Task['title'];

  @IsOptional()
  @IsString()
  description?: Task['description'];

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
