import { UserEntity } from 'src/user/entities/user.entity';

export class UserResponse {
  id: number;
  username: string;

  static toResponse(user: UserEntity): UserResponse {
    const model = new UserResponse();
    model.id = user.id;
    model.username = user.login;
    return model;
  }
}
