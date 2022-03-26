import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { User } from './decorators/user.decorator';
import { MessageDto } from './dto/message.dto';
import { UsernameDto } from './dto/username.dto';
import { AllExceptionsFilter } from './filters/exception.filters';
import { WsGuard } from './guards/ws.guard';
import { SocketValidationPipe } from './pipes/socket-validation.pipe';

@UseGuards(WsGuard)
@UsePipes(new SocketValidationPipe())
@UseFilters(new AllExceptionsFilter())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  sockets: Map<number, Socket> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  handleDisconnect(client: Socket | any) {
    if (client.user?.id && this.sockets.has(client.user?.id)) {
      this.sockets.delete(client.user.id);
    }

    console.log('sockets: ', this.sockets.size);
  }

  @UseGuards(WsGuard)
  async handleConnection(client: Socket | any) {
    const user = await this.userService.getUserWithAuthToken(
      client.handshake.headers?.authorization || '',
    );

    if (!user) {
      client.disconnect();
      return;
    }
    client.user = user;
    this.sockets.set(user.id, client);
    console.log('sockets: ', this.sockets.size);
  }

  @SubscribeMessage('create-message')
  async sendMessage(
    @User() user: UserEntity,
    @MessageBody() message: MessageDto,
  ) {
    const messageItem = await this.chatService.create(user, message);
    this.chatService.sendMessageToFriend(this.sockets, messageItem);
    return {
      event: 'message-created',
      data: messageItem,
    };
  }

  @SubscribeMessage('createChat')
  async createChat(
    @User() user: UserEntity,
    @MessageBody() usernameDto: UsernameDto,
  ) {
    const newChat = await this.chatService.createChat(
      user,
      usernameDto.username,
    );

    this.chatService.sendEventToFriend(
      this.sockets,
      newChat.friend.id,
      'new-chat',
      newChat.setFriend(user),
    );

    return {
      event: 'chat-create',
      data: newChat,
    };
  }

  @SubscribeMessage('chats')
  async getChats(@User() user: UserEntity) {
    return { event: 'chats', data: await this.chatService.getChats(user) };
  }

  @SubscribeMessage('getChatMessage')
  getChat(@User() user: UserEntity, @MessageBody() id: number) {
    return this.chatService.getChatMessage(user, id);
  }

  @SubscribeMessage('test')
  user(@User() user: UserEntity) {
    return { event: 'test', data: user };
  }
}
