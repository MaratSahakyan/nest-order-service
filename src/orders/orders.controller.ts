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
import { ResponseDTO } from 'src/common/dto';
import { CreateOrderDto } from './dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAllOrders();
  }

  @Get('status')
  async findOrdersByStatus(@Query('status') status: string) {
    return this.ordersService.findOrdersByStatus(status);
  }

  @Get(':id')
  async findByOrderId(@Param('id') orderId: string): Promise<OrderEntity> {
    return await this.ordersService.findByOrderId(orderId);
  }

  @Get('/customer/:customerId')
  async findAllByCustomerId(
    @Param('id') customerId: string,
  ): Promise<OrderEntity[]> {
    return await this.ordersService.findAllByCustomerId(customerId);
  }

  @Get('customer/:customerId/orders')
  async getCustomerOrders(
    @Param('customerId') customerId: string,
    @Query('status') status: string,
  ) {
    return this.ordersService.findCustomerOrderByStatus(customerId, status);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() order: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersService.createOrder(order);
  }

  @Patch(':id')
  async update(
    @Param('id') orderId: string,
    @Body() order: CreateOrderDto,
  ): Promise<OrderEntity> {
    return await this.ordersService.updateOrder(orderId, order);
  }

  @Delete(':id')
  async delete(@Param('id') orderId: string): Promise<ResponseDTO> {
    return await this.ordersService.deleteOrder(orderId);
  }
}
