import { IsNotEmpty, IsString } from 'class-validator';
import { Task } from '../task.entity';

export class CreateTaskDto implements Pick<Task, 'title' | 'description'> {
  @IsNotEmpty()
  @IsString()
  title!: Task['title'];

  @IsNotEmpty()
  @IsString()
  description!: Task['description'];
}
