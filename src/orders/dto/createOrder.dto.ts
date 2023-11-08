import { IsIn, IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { constant } from 'src/common/constant';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsInt({ message: constant.QUANTITY_MUST_BE_INETEGER })
  @Min(1, { message: constant.QUANTITY_AT_LEAST_VALUE })
  quantity: number;

  @IsNumber()
  @Min(0.01, { message: constant.PRICE_AT_LEAST_VALUE })
  price: number;

  @IsIn(['Pending', 'Completed', 'Cancelled'], {
    message: constant.ORDER_STATUS_REQ_VALUE,
  })
  status: string;

  @IsUUID('4', { message: constant.CUSTOMER_ID_REQUIREMENTS })
  customerId: string;
}
