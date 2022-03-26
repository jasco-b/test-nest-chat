import { UserEntity } from 'src/user/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { MessageResponse } from './message.response';
import { UserResponse } from './user.response';

export class ChatResponse {
  id: number;
  friend: UserResponse;
  messages?: MessageResponse[];

  static toResponse(chat: Chat, user: UserEntity): ChatResponse {
    const model = new ChatResponse();
    model.id = chat.id;
    model.friend = UserResponse.toResponse(
      +user.id === +chat.user1.id ? chat.user2 : chat.user1,
    );

    if (chat.messages && chat.messages.length > 0) {
      model.messages = chat.messages.map((message) => {
        message.chat = chat;
        return MessageResponse.toResponse(message);
      });
    }

    return model;
  }

  setFriend(user: UserEntity): ChatResponse {
    const chatFriend = new ChatResponse();
    chatFriend.id = this.id;
    chatFriend.messages = this.messages;
    chatFriend.friend = UserResponse.toResponse(user);
    return chatFriend;
  }
}
