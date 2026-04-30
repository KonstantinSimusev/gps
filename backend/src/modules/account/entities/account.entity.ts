import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Employee } from '../../employee/entities/employee.entity';

@Entity({
  schema: 'gps',
  name: 'accounts',
})
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'login',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    name: 'hashed_password',
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  hashedPassword: string;

  @Column({
    name: 'hashed_refresh_token',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  hashedRefreshToken: string | null;

  @OneToOne(() => Employee, (employee) => employee.account)
  employee: Employee;
}
