import { BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareData } from 'src/common/helper';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto';
import { constant } from 'src/common/constant';
import { TokenTypes } from './types';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  createAccessToken(tokenData: TokenTypes) {
    return this.jwtService.sign(tokenData, { expiresIn: '15m' });
  }

  createRefreshToken(tokenData: TokenTypes) {
    return this.jwtService.sign(
      { ...tokenData, tokenID: uuid() },
      { expiresIn: '7d' },
    );
  }

  decodeRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(constant.INVALID_REFRESH_TOKEN);
    }
  }

  async validateUser(username: string, password: string): Promise<TokenTypes> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException();
    }
    const isPassordMatched = await compareData(password, user.password);
    if (!isPassordMatched) {
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
