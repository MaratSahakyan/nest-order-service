import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/dto';
import { CreateOrderDto } from './dto';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusesEnum } from './enums/orderStatuses.enum';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAllOrders();
  }

  @Get('status')
  @ApiQuery({
    name: 'status',
    type: String,
    enum: OrderStatusesEnum,
  })
  async findOrdersByStatus(@Query('status') status: OrderStatusesEnum) {
    return this.ordersService.findOrdersByStatus(status);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findByOrderId(@Param('id') orderId: string): Promise<OrderEntity> {
    return await this.ordersService.findByOrderId(orderId);
  }

  @Get('/customer/:customerId')
  @ApiParam({
    name: 'customerId',
    type: String,
  })
  async findAllByCustomerId(
    @Param('id') customerId: string,
  ): Promise<OrderEntity[]> {
    return await this.ordersService.findAllByCustomerId(customerId);
  }

  @Get('customer/:customerId/orders')
  @ApiParam({
    name: 'customerId',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    type: String,
    enum: OrderStatusesEnum,
  })
  async getCustomerOrders(
    @Param('customerId') customerId: string,
    @Query('status') status: OrderStatusesEnum,
  ) {
    return this.ordersService.findCustomerOrderByStatus(customerId, status);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() order: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersService.createOrder(order);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async update(
    @Param('id') orderId: string,
    @Body() order: CreateOrderDto,
  ): Promise<OrderEntity> {
    return await this.ordersService.updateOrder(orderId, order);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async delete(@Param('id') orderId: string): Promise<ResponseDTO> {
    return await this.ordersService.deleteOrder(orderId);
  }
}
