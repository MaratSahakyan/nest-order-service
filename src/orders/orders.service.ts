import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { ResponseDTO } from 'src/common/dto';
import { Pagination } from 'src/pagination/interfaces/pagination.interfaces';
import { PaginationService } from 'src/pagination/pagination.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusesEnum } from './enums/orderStatuses.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    private paginationService: PaginationService,
  ) {}

  async findAllOrders({ page, limit }): Promise<Pagination<OrderEntity>> {
    return await this.paginationService.paginate(this.ordersRepository, {
      page,
      limit,
      route: `orders`,
    });
  }

  async findOrdersByStatus(status: OrderStatusesEnum): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({ where: { status } });
  }

  async findByOrderId(orderId: string): Promise<OrderEntity> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(constant.ORDER_DOES_NOT_EXIST);
    }

    return order;
  }

  async findAllByCustomerId({
    page,
    limit,
    customerId,
  }): Promise<Pagination<OrderEntity>> {
    return await this.paginationService.paginate(this.ordersRepository, {
      page,
      limit,
      route: `orders/${customerId}`,
      where: { customerId },
    });
  }

  async findCustomerOrderByStatus({
    customerId,
    status,
    page,
    limit,
  }): Promise<Pagination<OrderEntity>> {
    return await this.paginationService.paginate(this.ordersRepository, {
      page,
      limit,
      route: `orders/${customerId}`,
      where: { customerId, status },
    });
  }

  async createOrder(order: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersRepository.save(order);
  }

  async updateOrder(
    orderId: string,
    order: CreateOrderDto,
  ): Promise<OrderEntity> {
    const mainOrder = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!mainOrder) {
      throw new NotFoundException(constant.ORDER_DOES_NOT_EXIST);
    }

    if (mainOrder.customerId !== order.customerId) {
      throw new BadRequestException(constant.CUSTOMER_ID_CANT_BE_CHANGED);
    }

    return this.ordersRepository
      .createQueryBuilder('order')
      .update(OrderEntity)
      .set(order)
      .where('id = :id', { id: orderId })
      .returning('*')
      .execute()
      .then((response) => {
        if (response?.raw[0]) {
          return response.raw[0];
        }
        throw response;
      })
      .catch((error) => {
        throw new NotFoundException({ error });
      });
  }

  async deleteOrder(orderId: string): Promise<ResponseDTO> {
    return this.ordersRepository
      .createQueryBuilder()
      .delete()
      .from(OrderEntity)
      .where('id = :id', { id: orderId })
      .execute()
      .then(() => {
        return {
          status: HttpStatus.OK,
          message: constant.CUSTOMER_DELETED,
        };
      })
      .catch(() => {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: constant.CUSTOMER_DELETED_FAIL,
        };
      });
  }

  async deleteOrdersByCustomerId(customerId: string): Promise<ResponseDTO> {
    try {
      const deleteResult = await this.ordersRepository
        .createQueryBuilder()
        .delete()
        .from(OrderEntity)
        .where('customerId = :customerId', { customerId })
        .execute();

      if (deleteResult.affected) {
        return {
          status: HttpStatus.OK,
          message: constant.ORDERS_DELETED,
        };
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: constant.NO_ORDERS_FOUND,
        };
      }
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: constant.ORDER_DELETION_FAIL,
      };
    }
  }
}
