import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  getByUsername(login: string) {
    return this.findOne({
      where: {
        login,
      },
    });
  }

  getByToken(token: string) {
    return this.findOne({
      where: {
        token,
      },
    });
  }

  getById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
