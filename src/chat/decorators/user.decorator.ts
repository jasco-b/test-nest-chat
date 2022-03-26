import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client: Socket | any = ctx.switchToWs().getClient<Socket>();
    return client.user;
  },
);
