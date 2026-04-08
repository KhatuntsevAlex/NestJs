import { Task } from '../task.model';

export class UpdateTaskDto implements Partial<
  Pick<Task, 'title' | 'description' | 'status'>
> {
  title?: Task['title'];
  description?: Task['description'];
  status?: Task['status'];

  constructor({
    title,
    description,
    status,
  }: Partial<Pick<Task, 'title' | 'description' | 'status'>>) {
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
