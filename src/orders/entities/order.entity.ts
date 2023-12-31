import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusesEnum } from '../enums/orderStatuses.enum';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: OrderStatusesEnum,
    default: OrderStatusesEnum.PENDING,
  })
  status: OrderStatusesEnum;

  @Column()
  customerId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ update: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
