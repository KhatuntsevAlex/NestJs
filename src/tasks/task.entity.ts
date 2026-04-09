import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  status!: TaskStatus;

  @Column()
  @Expose({ groups: ['task.short'] })
  @Exclude({ toPlainOnly: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @Expose({ groups: ['task.detail'] })
  @Exclude({ toPlainOnly: true })
  user!: User;
}
