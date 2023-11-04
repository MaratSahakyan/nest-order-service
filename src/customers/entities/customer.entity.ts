import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'date' })
  dob: Date;
}
