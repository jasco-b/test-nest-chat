import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatMessage } from 'src/chat/entities/chat-message.entity';
import { randomUUID } from 'crypto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password_hash: string;

  @Column({ unique: true, nullable: true })
  token: string;

  @OneToMany(() => Chat, (chat) => chat.user1 || chat.user2)
  chats: Chat[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  messages: ChatMessage[];

  @CreateDateColumn()
  created_at: string;

  async setPassword(password: string): Promise<void> {
    const hash = await bcrypt.hash(password, 12);
    this.password_hash = hash;
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  generateToken(): void {
    this.token = randomUUID();
  }
}
