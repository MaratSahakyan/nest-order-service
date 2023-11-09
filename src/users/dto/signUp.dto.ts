import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { constant } from 'src/common/constant';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50, { message: constant.WEAK_PASSWORD_MESSAGE })
  password: string;
}
