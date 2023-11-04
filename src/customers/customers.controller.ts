import { CustomerEntity } from './entities/customer.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ResponseDTO } from 'src/common/dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<CustomerEntity[]> {
    return await this.customersService.findAllCustomers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomerEntity> {
    return await this.customersService.findByCustomerID(id);
  }

  @Post()
  async create(@Body() customer: CustomerEntity): Promise<CustomerEntity> {
    return await this.customersService.createCustomer(customer);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() customer: CustomerEntity,
  ): Promise<CustomerEntity> {
    return await this.customersService.updateCustomer(id, customer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseDTO> {
    return await this.customersService.deleteCustomer(id);
  }
}
