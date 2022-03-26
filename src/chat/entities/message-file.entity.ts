import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('message_files')
export class MessageFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  path: string;

  @OneToOne(() => ChatMessage, (chatMessage) => chatMessage.file)
  message: ChatMessage;

  @CreateDateColumn()
  created_at: string;
}
