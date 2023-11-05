import { Body, Controller, Post } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserInput } from './inputs/user.input';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async signup(@Body() userData: UserInput): Promise<UserEntity> {
    return await this.usersService.signup(userData);
  }
}
