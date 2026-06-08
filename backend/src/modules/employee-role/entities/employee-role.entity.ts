import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from '../../employee/entities/employee.entity';
import { Role } from '../../role/entities/role.entity';

@Entity({
  schema: 'gps',
  name: 'employee_roles',
})
export class EmployeeRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Связь: много ролей сотрудника — одна роль
  @ManyToOne(() => Role, (role) => role.employeeRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Связь: много ролей сотрудника — один сотрудник
  @OneToOne(() => Employee, (employee) => employee.employeeRole)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
