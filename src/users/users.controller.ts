import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto';
import { TokenTypes } from './types';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'User Create' })
  @Post('create')
  async signup(@Body() userData: SignUpDto): Promise<TokenTypes> {
    return await this.usersService.signup(userData);
  }
}
