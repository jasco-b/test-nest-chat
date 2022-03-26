import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repos/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private repository: UserRepository,
  ) {}

  findByUsername(login: string): Promise<UserEntity | null> {
    return this.repository.getByUsername(login);
  }

  findByToken(token: string): Promise<UserEntity | null> {
    return this.repository.getByToken(token);
  }

  getUserWithAuthToken(
    authTokenWithBearer: string,
  ): Promise<UserEntity | null> {
    const token = authTokenWithBearer.match(new RegExp('Bearer (.*)'));
    if (!token) {
      return null;
    }

    const authToken: string = token.pop();
    if (authToken.trim() === '') {
      return null;
    }

    return this.findByToken(authToken);
  }
}
