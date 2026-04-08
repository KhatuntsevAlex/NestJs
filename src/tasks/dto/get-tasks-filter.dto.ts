import { Task } from '../task.model';

export class GetTasksFilterDto implements GetTasksFilterDto {
  status?: Task['status'];
  search?: string;

  constructor({
    status,
    search,
  }: {
    status?: Task['status'];
    search?: string;
  }) {
    this.status = status;
    this.search = search;
  }
}
