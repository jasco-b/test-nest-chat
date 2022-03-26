import {
  Catch,
  ArgumentsHost,
  WsExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch()
export class AllExceptionsFilter implements WsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    console.log('stack', exception.stack);
    let message = exception.message;

    if (exception instanceof HttpException) {
      message = this.getMessage(exception.getResponse());
    }

    client.emit('exception', {
      status: 'error',
      message: message || 'Internal server error',
    });

    // console.log('exception', exception);
    // console.log('eClient', client);
  }

  private getMessage(message: any): string {
    if (
      typeof message === 'object' &&
      message !== null &&
      !Array.isArray(message)
    ) {
      return this.getMessage(message.message);
    }

    if (Array.isArray(message)) {
      return this.getMessage(message.shift());
    }

    return message || 'Internal server error';
  }
}
