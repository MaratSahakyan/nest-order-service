import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { ResponseDTO } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customersRepository: Repository<CustomerEntity>,
  ) {}

  async findAllCustomers(): Promise<CustomerEntity[]> {
    return this.customersRepository.find();
  }

  async findByCustomerID(customerID: string): Promise<CustomerEntity> {
    const findCustomer = await this.customersRepository.findOne({
      where: { id: customerID },
    });
    if (!findCustomer) {
      throw new NotFoundException(constant.CUSTOMER_DOES_NOT_EXIST);
    }
    return findCustomer;
  }

  async createCustomer(customer: CreateCustomerDto): Promise<CustomerEntity> {
    const findOneCustomer = await this.customersRepository.findOne({
      where: { username: customer.username },
      select: ['username'],
    });

    if (findOneCustomer && findOneCustomer.username) {
      throw new BadRequestException(constant.USERNAME_ALREADY_EXIST);
    }

    return this.customersRepository.save(customer);
  }

  async updateCustomer(
    id: string,
    customer: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const findOneCustomer = this.customersRepository.findOne({
      where: { id },
    });

    if (!findOneCustomer) {
      throw new BadRequestException(constant.CUSTOMER_DOES_NOT_EXIST);
    }

    return this.customersRepository
      .createQueryBuilder('customer')
      .update(CustomerEntity)
      .set(customer)
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then((response) => {
        if (response?.raw[0]) {
          return response.raw[0];
        }
        throw response;
      })
      .catch((error) => {
        throw new NotFoundException({
          error,
        });
      });
  }

  async deleteCustomer(id: string): Promise<ResponseDTO> {
    return this.customersRepository
      .createQueryBuilder()
      .delete()
      .from(CustomerEntity)
      .where('id = :id', { id: id })
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
}
