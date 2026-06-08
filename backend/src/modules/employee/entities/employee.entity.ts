import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Account } from '../../account/entities/account.entity';
import { EmployeeRole } from '../../employee-role/entities/employee-role.entity';
import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';
import { Position } from '../../position/entities/position.entity';
import { Team } from '../../team/entities/team.entity';

@Entity({
  schema: 'gps',
  name: 'employees',
})
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
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'patronymic',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  patronymic: string;

  @Column({
    name: 'personal_number',
    type: 'integer',
    nullable: false,
    unique: true,
  })
  personalNumber: number;

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
    name: 'has_access',
    default: true,
    nullable: false,
  })
  hasAccess: boolean;

  @Column({
    name: 'is_active',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  // Связь: один сотрудник — один аккаунт
  @OneToOne(() => Account, (account) => account.employee, {
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  // Связь: много сотрудников — одна бригада
  @ManyToOne(() => Team, (team) => team.employees)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: много сотрудников — одна штатная позиция
  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  // Связь: много сотрудников — одна текущая бригада
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'current_team_id' })
  currentTeam: Team | null;

  // Связь: много сотрудников — одна текущая штатная позиция
  @ManyToOne(() => Position, { nullable: true })
  @JoinColumn({ name: 'current_position_id' })
  currentPosition: Position | null;

  // Связь: один сотрудник — одна роль сотрудника
  @OneToOne(() => EmployeeRole, (employeeRole) => employeeRole.employee, {
    cascade: ['remove'],
  })
  employeeRole: EmployeeRole;

  // Связь: один сотрудник — много смен сотрудника
  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.employee)
  employeeShifts: EmployeeShift[];
}
