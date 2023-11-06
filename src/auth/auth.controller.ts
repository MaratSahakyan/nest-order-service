import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
  // async login(@Res() res: Response, @Body() loginData: LoginDto) {
  //   return this.authService.login(res, loginData);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshData: { refreshToken: string }) {
    return this.authService.refreshTokens(refreshData.refreshToken);
  }
  // async refresh(@Res() res: Response, @Req() req: Request) {
  //   return this.authService.refreshTokens(res, req);
  // }
}
