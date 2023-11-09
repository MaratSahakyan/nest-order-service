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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto';
import { CustomerEntity } from './entities/customer.entity';

@ApiTags('customers')
@ApiBearerAuth()
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

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
  ): Promise<Pagination<CustomerEntity>> {
    return this.customersService.findAllCustomers({
      page,
      limit: Math.min(100, limit),
    });
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
