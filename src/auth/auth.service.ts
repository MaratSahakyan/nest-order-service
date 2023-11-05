import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareData } from 'src/common/helper';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(username: string, password: string): Promise<SignInDto> {
    const user = await this.usersService.findOne(username);
    const { password: userPassword, ...rest } = user;
    const isPasswordMatched = compareData(password, userPassword);
    if (!isPasswordMatched) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const tokens = this.getTokens(payload);
    delete user.password;

    return {
      ...rest,
      ...tokens,
    };
  }

  async getTokens(tokenProperties): Promise<any> {
    const promises = [
      this.jwtService.signAsync(tokenProperties, {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(tokenProperties, {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ];

    const [accessToken, refreshToken] = await Promise.all(promises);

    return {
      accessToken,
      refreshToken,
    };
  }
}
