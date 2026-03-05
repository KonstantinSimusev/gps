import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { Employee } from '../../employees/entities/employee.entity';

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
    name: 'refresh_token',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  refreshToken: string | null;

  @OneToOne(() => Employee, (employee) => employee.account)
  employee: Employee;
}
