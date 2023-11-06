import { AuthorizationGuard } from './../guards/authorization.guard';
import { CustomerEntity } from './entities/customer.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ResponseDTO } from 'src/common/dto';
import { AuthentificationGuard } from 'src/guards/authentification.guard';
import { Role } from 'src/decorators/roles.decorator';
import { CreateCustomerDto } from './dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Role('USER')
  @UseGuards(AuthentificationGuard, AuthorizationGuard)
  @Get()
  async findAll(): Promise<CustomerEntity[]> {
    return await this.customersService.findAllCustomers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomerEntity> {
    return await this.customersService.findByCustomerID(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() customer: CreateCustomerDto): Promise<CustomerEntity> {
    return await this.customersService.createCustomer(customer);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() customer: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return await this.customersService.updateCustomer(id, customer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseDTO> {
    return await this.customersService.deleteCustomer(id);
  }
}
