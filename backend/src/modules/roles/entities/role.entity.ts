import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { EmployeeRole } from '../../employee-roles/entities/employee-role.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  // Связь: одна роль — много позиций
  @OneToMany(() => Position, (position) => position.role)
  positions: Position[];

  // Связь: одна роль — много ролей сотрудника
  @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.role)
  employeeRoles: EmployeeRole[];
}
