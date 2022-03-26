import { MessageFiles } from '../entities/message-file.entity';

export class FileResponse {
  url: string;
  type: string;
  name?: string;

  static toResponse(messageFile: MessageFiles): FileResponse {
    const model = new FileResponse();
    model.type = messageFile.type;
    model.url = messageFile.path;
    model.name = messageFile.name;

    return model;
  }
}
