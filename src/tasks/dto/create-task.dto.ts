import { Task } from '../task.model';

export class CreateTaskDto implements Pick<Task, 'title' | 'description'> {
  title: Task['title'];
  description: Task['description'];

  constructor({ title, description }: Pick<Task, 'title' | 'description'>) {
    this.title = title;
    this.description = description;
  }
}
