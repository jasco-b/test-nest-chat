import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { MessageFiles } from './entities/message-file.entity';
import { UserModule } from 'src/user/user.module';
import { ChatRepository } from './repos/chat.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository, ChatMessage, MessageFiles]),
    UserModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
