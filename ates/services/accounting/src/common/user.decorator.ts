import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IUser } from '../user/types/user';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
