import { ChatMessage } from '../entities/chat-message.entity';
import { FileResponse } from './file.response';

export class MessageResponse {
  id: number;
  text: string;
  file?: FileResponse;
  created_at: string;
  user_id: number;
  chat_id: number;

  static toResponse(message: ChatMessage): MessageResponse {
    const model = new MessageResponse();
    model.id = message.id;
    model.text = message.message;
    model.created_at = message.created_at;
    model.user_id = +message.user.id;
    model.chat_id = message.chat?.id;

    if (message.file && Object.keys(message.file).length > 0) {
      model.file = FileResponse.toResponse(message.file);
    }

    return model;
  }
}
