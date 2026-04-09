import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
  OneToMany,
} from 'typeorm';

import { Position } from '../../positions/entities/position.entity';
import { Team } from '../../teams/entities/team.entity';
import { Account } from '../../accounts/entities/account.entity';
import { EmployeeRole } from '../../employee-roles/entities/employee-role.entity';

@Entity({
  schema: 'gps',
  name: 'employees',
})
@Unique(['lastName', 'firstName', 'patronymic'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'patronymic',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  patronymic: string;

  @Column({
    name: 'personal_number',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  personalNumber: string;

  @Column({
    name: 'birth_day',
    type: 'date',
    nullable: false,
  })
  birthDay: Date;

  @Column({
    name: 'start_date',
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date | null;

  @Column({
    name: 'is_active',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  // Связь: один сотрудник — один аккаунт
  @OneToOne(() => Account, (account) => account.employee)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  // Связь: много сотрудников — одна позиция
  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  // Связь: много сотрудников — одна бригада
  @ManyToOne(() => Team, (team) => team.employees)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: один сотрудник — много ролей сотрудника
  @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.employee, {
    cascade: ['remove'],
  })
  employeeRoles: EmployeeRole[];
}
