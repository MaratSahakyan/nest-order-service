import { AuthenticationGuard } from './../guards/authentication.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, TokensDto } from './dto';
import { UserDataType } from './types/userData.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
  // async login(@Res() res: Response, @Body() loginData: LoginDto) {
  //   return this.authService.login(res, loginData);
  // }

  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ description: 'User Data' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Get('my-data')
  async myData(@Req() req: Request): Promise<UserDataType> {
    return await this.authService.myData(req);
  }

  @ApiOkResponse({ description: 'Refresh Tokens' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: TokensDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshData: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshData.refreshToken);
  }
  // async refresh(@Res() res: Response, @Req() req: Request) {
  //   return this.authService.refreshTokens(res, req);
  // }
}
