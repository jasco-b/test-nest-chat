import { UserEntity } from '../entities/user.entity';

export class UserDto {
  id?: number;
  login: string;
  token?: string;

  static fromEntity(user: UserEntity, needUserToken = false): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.login = user.login;

    if (needUserToken) {
      userDto.token = user.token;
    }
    return userDto;
  }
}
