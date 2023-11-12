import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/dto';
import { Pagination } from 'src/pagination/interfaces/pagination.interfaces';
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
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<OrderEntity>> {
    return await this.ordersService.findAllOrders({
      page,
      limit: Math.min(100, limit),
    });
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
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  async findAllByCustomerId(
    @Param('customerId') customerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<OrderEntity>> {
    return await this.ordersService.findAllByCustomerId({
      page,
      limit,
      customerId,
    });
  }

  @Get(':customerId/:status')
  @ApiParam({
    name: 'customerId',
    type: String,
  })
  @ApiParam({
    name: 'status',
    type: String,
    enum: OrderStatusesEnum,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  async getCustomerOrders(
    @Param('customerId') customerId: string,
    @Param('status') status: OrderStatusesEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.ordersService.findCustomerOrderByStatus({
      customerId,
      status,
      page,
      limit,
    });
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

  @Delete('delete/:customerId')
  @ApiParam({
    name: 'customerId',
    type: String,
  })
  async deleteOrdersByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<ResponseDTO> {
    return await this.ordersService.deleteOrdersByCustomerId(customerId);
  }
}
