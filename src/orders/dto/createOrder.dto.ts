import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { constant } from 'src/common/constant';
import { OrderStatusesEnum } from '../enums/orderStatuses.enum';

export class CreateOrderDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsInt({ message: constant.QUANTITY_MUST_BE_INETEGER })
  @Min(1, { message: constant.QUANTITY_AT_LEAST_VALUE })
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0.01, { message: constant.PRICE_AT_LEAST_VALUE })
  price: number;

  @ApiProperty({
    type: String,
    enum: OrderStatusesEnum,
    default: OrderStatusesEnum.PENDING,
  })
  @IsIn(['Pending', 'Completed', 'Cancelled'], {
    message: constant.ORDER_STATUS_REQ_VALUE,
  })
  status?: OrderStatusesEnum;

  @ApiProperty({ type: String })
  @IsUUID('4', { message: constant.CUSTOMER_ID_REQUIREMENTS })
  customerId: string;
}
