import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import * as entities from './database/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: 'task-management',
        autoLoadEntities: true,
        synchronize: true,
        entities: Object.values(entities),
      }),
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
