import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  getUserChats(user_id: number): Promise<Chat[]> {
    return this.find({
      where: [{ user1: user_id }, { user2: user_id }],
      relations: [
        'user1',
        'user2',
        // 'messages',
        // 'messages.user',
        // 'messages.chat',
        // 'messages.file',
      ],
    });
  }

  getChatWithFriend(user_id: number, friend_id: number): Promise<Chat | null> {
    return this.findOne({
      where: [
        { user1: user_id, user2: friend_id },
        { user2: user_id, user1: friend_id },
      ],
    });
  }

  getChatWithMessages(user_id: number, chat_id: number): Promise<Chat | null> {
    return this.findOne({
      where: [
        { user1: user_id, id: chat_id },
        { user2: user_id, id: chat_id },
      ],
      relations: [
        'messages',
        'messages.user',
        'messages.file',
        'user1',
        'user2',
      ],
    });
  }

  getChatById(id: number): Promise<Chat | null> {
    return this.findOne({
      where: { id },
      relations: ['user1', 'user2'],
    });
  }
}
