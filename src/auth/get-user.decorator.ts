import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { Request } from 'express';

export const GetUser = createParamDecorator((_data, ctx): User => {
  const { user } = ctx.switchToHttp().getRequest<Request>();

  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
});
