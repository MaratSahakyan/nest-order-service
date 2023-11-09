import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, TokensDto } from './dto';

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
