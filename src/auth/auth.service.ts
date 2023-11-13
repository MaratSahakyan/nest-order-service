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
import { UserDataType } from './types/userData.type';

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

  async decodeRefreshToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findOne(decodedToken.username);

      // const isTokenValid = await compareData(token, user.refreshToken);

      if (token !== user.refreshToken) {
        throw new UnauthorizedException(constant.INVALID_REFRESH_TOKEN);
      }

      return { id: user.id, username: user.username, role: user.role };
    } catch (error) {
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

    await this.usersService.updateRefreshTokenInDb(
      userTokenPayload.id,
      refreshToken,
    );

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    // });

    return { accessToken, refreshToken };
  }

  async myData(request): Promise<UserDataType> {
    const token = request.headers.authorization.split(' ')[1];

    const userDecodedData = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });

    const user = await this.usersService.findOne(userDecodedData.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password, delete user.refreshToken;

    return user;
  }

  async refreshTokens(oldRefreshToken): Promise<TokensDto> {
    // const oldRefreshToken = req.cookies['refreshToken'];

    const userDecodedData = await this.decodeRefreshToken(oldRefreshToken);
    const newAccessToken = this.createAccessToken(userDecodedData);
    const newRefreshToken = this.createRefreshToken(userDecodedData);

    await this.usersService.updateRefreshTokenInDb(
      userDecodedData.id,
      newRefreshToken,
    );

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    // });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
