import { IsString, Length } from 'class-validator';
import { constant } from 'src/common/constant';

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  @Length(3, 50, { message: constant.WEAK_PASSWORD_MESSAGE })
  password: string;
}
