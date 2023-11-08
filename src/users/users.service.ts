import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { constant } from 'src/common/constant';
import { hashData } from 'src/common/helper';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { TokenTypes } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async updateRefreshTokenInDb(userId: string, refreshToken: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hashedRefreshToken = await hashData(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async signup(userData: SignUpDto): Promise<TokenTypes> {
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

    const payload = { id: user.id, username: user.username, role: user.role };

    const accessToken = this.authService.createAccessToken(payload);
    const refreshToken = this.authService.createRefreshToken(payload);

    await this.updateRefreshTokenInDb(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
