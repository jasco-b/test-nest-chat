import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageFiles } from './message-file.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, type: 'text' })
  message: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  user: UserEntity;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @OneToOne(() => MessageFiles, (messageFile) => messageFile.message, {
    cascade: true,
  })
  @JoinColumn()
  file: MessageFiles;

  @CreateDateColumn()
  created_at: string;
}
