import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto';
import { TokenTypes } from './types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async signup(@Body() userData: SignUpDto): Promise<TokenTypes> {
    return await this.usersService.signup(userData);
  }
}
