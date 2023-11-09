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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto';
import { CustomerEntity } from './entities/customer.entity';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<CustomerEntity[]> {
    return await this.customersService.findAllCustomers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOne(@Param('id') id: string): Promise<CustomerEntity> {
    return await this.customersService.findByCustomerID(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() customer: CreateCustomerDto): Promise<CustomerEntity> {
    return await this.customersService.createCustomer(customer);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() customer: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return await this.customersService.updateCustomer(id, customer);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  async delete(@Param('id') id: string): Promise<ResponseDTO> {
    return await this.customersService.deleteCustomer(id);
  }
}
