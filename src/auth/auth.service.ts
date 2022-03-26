import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repos/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private repository: UserRepository,
  ) {}
  async register(registerDto: RegisterDto): Promise<UserDto> {
    const oldUser = await this.findbyUsername(registerDto.login);
    if (oldUser && oldUser.id > 0) {
      throw new BadRequestException('User already exists with usernae');
    }

    const user = this.repository.create(registerDto);
    await user.setPassword(registerDto.password);
    user.generateToken();

    const userEntity = await this.repository.save(user);

    return UserDto.fromEntity(userEntity);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const user = await this.findbyUsername(loginDto.login);
    const errorMessage = 'Login or password is wrong';
    if (!user) {
      throw new BadRequestException(errorMessage);
    }

    const isPasswordCorrect = await user.checkPassword(loginDto.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException(errorMessage);
    }

    return UserDto.fromEntity(user, true);
  }

  private findbyUsername(login: string): Promise<UserEntity | null> {
    return this.repository.getByUsername(login);
  }
}
