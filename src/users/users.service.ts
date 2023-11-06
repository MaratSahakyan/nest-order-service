import { UserEntity } from './entities/user.entity';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { constant } from 'src/common/constant';
import { hashData } from 'src/common/helper';
import { AuthService } from 'src/auth/auth.service';
import { TokenTypes } from './types';
import { SignUpDto } from './dto';

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

    return { accessToken, refreshToken };
  }
}
