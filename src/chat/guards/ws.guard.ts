import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket | any = context.switchToWs().getClient<Socket>();
    const bearerAuthToken: string =
      client.handshake?.headers?.authorization || '';

    const user = await this.userService.getUserWithAuthToken(bearerAuthToken);

    if (!user) {
      client.disconnect();
      return false;
    }

    client.user = user;
    return true;
  }
}
