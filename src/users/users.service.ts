import { UserEntity } from './entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInput } from './inputs/user.input';
import { Repository } from 'typeorm';
import { constant } from 'src/common/constant';
import { hashData } from 'src/common/helper';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserInput) private userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async signup(userData: UserInput): Promise<UserEntity> {
    const { password, username } = userData;
    const findOneUser = await this.findOne(username);

    if (findOneUser && findOneUser.username) {
      throw new BadRequestException(constant.USERNAME_ALREADY_EXIST);
    }

    const hashedPassword = await hashData(password);

    const user = await this.userRepository.save({
      username,
      password: hashedPassword,
    });

    const tokens = await this.authService.getTokens({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { ...tokens, ...user };
  }
}
