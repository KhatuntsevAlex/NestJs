import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  imports: [AuthModule],
})
export class TasksModule {}
