import { IsString, Length, Matches } from 'class-validator';
import { constant } from 'src/common/constant';

export class CreateCustomerDto {
  @IsString()
  @Length(3, 50, { message: constant.INVALID_FIRST_NAME_RANGE_MESSAGE })
  firstName: string;

  @IsString()
  @Length(3, 50, { message: constant.INVALID_LAST_NAME_RANGE_MESSAGE })
  lastName: string;

  @IsString()
  @Length(3, 50, { message: constant.INVALID_USER_NAME_RANGE_MESSAGE })
  username: string;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/, {
    message: constant.INCORRECT_DOB_FORMAT,
  })
  dob: string;
}
