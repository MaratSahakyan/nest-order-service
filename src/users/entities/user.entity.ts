import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Length(2, 25)
  username: string;

  @Column()
  @Length(8, 50)
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ update: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
