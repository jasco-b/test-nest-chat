import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserEntity, (user) => user.chats)
  user1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user2: UserEntity;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat)
  messages: ChatMessage[];

  @CreateDateColumn()
  created_at: string;
}
