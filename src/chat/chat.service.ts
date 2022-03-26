import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repos/user.repository';
import { Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { Chat } from './entities/chat.entity';
import { MessageFiles } from './entities/message-file.entity';
import { ChatRepository } from './repos/chat.repo';
import { ChatResponse } from './responses/chat.response';
import { MessageResponse } from './responses/message.response';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { FileDto } from './dto/file.dto';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository) private chatRepository: ChatRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(MessageFiles)
    private messageFileRepository: Repository<MessageFiles>,
  ) {}

  async createChat(user: UserEntity, username: string) {
    const friend = await this.userRepository.getByUsername(username);
    if (!friend) {
      throw new WsException('user not found');
    }

    if (+friend.id === +user.id) {
      throw new WsException('you cannot chat with yourseld');
    }
    const chat = await this.chatRepository.getChatWithFriend(
      user.id,
      friend.id,
    );

    if (chat) {
      throw new WsException('Chat already exits');
    }

    const chatEntity = new Chat();
    chatEntity.user1 = user;
    chatEntity.user2 = friend;
    await this.chatRepository.save(chatEntity);

    return ChatResponse.toResponse(chatEntity, user);
  }

  async create(user: UserEntity, message: MessageDto) {
    if (+user.id === +message.user_id) {
      throw new WsException('The same users');
    }

    const chatPromise = this.chatRepository.getChatWithFriend(
      user.id,
      message.user_id,
    );

    const friendPromise = this.userRepository.getById(message.user_id);

    // eslint-disable-next-line prefer-const
    let [chat, friend] = await Promise.all([chatPromise, friendPromise]);

    if (!friend) {
      throw new WsException('User not found');
    }

    if (!chat) {
      chat = new Chat();
      chat.user1 = user;
      chat.user2 = friend;
      chat = await this.chatRepository.save(chat);
    }

    let messageEntity = new ChatMessage();
    messageEntity.message = message.message;
    messageEntity.user = user;
    messageEntity.chat = chat;

    if (message.file && message.file?.content) {
      this.saveFile(message.file);
      const file = new MessageFiles();
      // file.message = messageEntity;
      file.name = message.file.name;
      file.type = message.file.type;
      file.path = message.file.path;
      // await this.messageFileRepository.save(file);
      messageEntity.file = file;
      console.log('extention', message.file.getExtention());
    }

    messageEntity = await this.chatMessageRepository.save(messageEntity);

    return MessageResponse.toResponse(messageEntity);
  }

  async getChats(user: UserEntity): Promise<ChatResponse[]> {
    const chats = await this.chatRepository.getUserChats(user.id);

    return chats.map((chat) => ChatResponse.toResponse(chat, user));
  }

  async getChatMessage(user: UserEntity, id: number): Promise<ChatResponse> {
    const chat = await this.chatRepository.getChatWithMessages(user.id, id);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    return ChatResponse.toResponse(chat, user);
  }

  private async saveFile(fileDto: FileDto) {
    const imgBuffer = Buffer.from(fileDto.content, 'base64');
    const s = new Readable();
    const filename =
      randomUUID() +
      (fileDto.getExtention().length > 0 ? '.' + fileDto.getExtention() : '');
    fileDto.path = '/images/' + filename;
    s.push(imgBuffer);
    s.push(null);
    const pathToDir = join(process.cwd(), 'public', 'images');
    await mkdir(pathToDir, { recursive: true });
    s.pipe(createWriteStream(join(pathToDir, filename)));
  }

  async sendMessageToFriend(
    sockets: Map<number, Socket>,
    msg: MessageResponse,
  ): Promise<boolean> {
    const chat = await this.chatRepository.getChatById(msg.chat_id);
    if (!chat) {
      throw new WsException('Something wrong with server');
    }
    console.log('chat', chat);

    const friend_id =
      +chat.user1?.id === +msg.user_id ? chat.user2?.id : chat.user1?.id;

    if (!sockets.has(friend_id)) {
      console.log('friend id not found: ' + friend_id);
      return false;
    }

    sockets.get(friend_id).emit('new-message', msg);
  }

  async sendEventToFriend(
    sockets: Map<number, Socket>,
    friend_id: number,
    event: string,
    data: object,
  ) {
    if (!sockets.has(friend_id)) {
      console.log('friend id not found: ' + friend_id);
      return false;
    }

    sockets.get(friend_id).emit(event, data);
  }
}
