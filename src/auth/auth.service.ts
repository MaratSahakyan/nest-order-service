import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { constant } from 'src/common/constant';
import { compareData } from 'src/common/helper';
import { UsersService } from 'src/users/users.service';
import { TokensDto } from './dto';
import { TokenTypes } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  createAccessToken(tokenData: TokenTypes) {
    const expirationTime = Math.floor(Date.now() / 1000) + 15 * 60;
    return this.jwtService.sign(
      { ...tokenData, exp: expirationTime },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      },
    );
  }

  createRefreshToken(tokenData: TokenTypes) {
    const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    return this.jwtService.sign(
      { ...tokenData, exp: expirationTime },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      },
    );
  }

  decodeRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException(constant.INVALID_REFRESH_TOKEN);
    }
  }

  async validateUser(username: string, password: string): Promise<TokenTypes> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException();
    }
    const isPasswordMatched = await compareData(password, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException();
    }
    return { id: user.id, username: user.username, role: user.role };
  }

  async login(loginData): Promise<TokensDto> {
    const { username, password } = loginData;

    const userTokenPayload = await this.validateUser(username, password);

    const accessToken = this.createAccessToken(userTokenPayload);
    const refreshToken = this.createRefreshToken(userTokenPayload);

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    // });

    return { accessToken, refreshToken };
  }

  refreshTokens(oldRefreshToken): TokensDto {
    // const oldRefreshToken = req.cookies['refreshToken'];

    const userDecodedToken = this.decodeRefreshToken(oldRefreshToken);
    const newAccessToken = this.createAccessToken(userDecodedToken);
    const newRefreshToken = this.createRefreshToken(userDecodedToken);

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    // });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
