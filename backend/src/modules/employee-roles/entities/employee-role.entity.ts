import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity({
  schema: 'gps',
  name: 'employee_roles',
})
@Unique(['employee'])
export class EmployeeRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Связь: много ролей сотрудника — одна роль
  @ManyToOne(() => Role, (role) => role.employeeRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Связь: много ролей сотрудника — один сотрудник
  @ManyToOne(() => Employee, (employee) => employee.employeeRoles)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
