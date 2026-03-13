import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';

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

@Entity({
  schema: 'gps',
  name: 'employee_roles',
})
export class EmployeeRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'is_active',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  // Связь: много ролей сотрудника — одна роль
  @ManyToOne(() => Role, (role) => role.employeeRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Связь: много ролей сотрудника — один сотрудник
  @ManyToOne(() => Employee, (employee) => employee.employeeRoles)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}

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

  // Связь: много сотрудников — одна позиция
  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  // Связь: много сотрудников — одна бригада
  @ManyToOne(() => Team, (team) => team.employees)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: один сотрудник — один аккаунт
  @OneToOne(() => Account, (account) => account.employee)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  // Связь: один сотрудник — много ролей сотрудника
  @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.employee)
  employeeRoles: EmployeeRole[];
}

@Entity({
  schema: 'gps',
  name: 'grades',
})
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'grade_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  gradeCode: string;

  // Связь: один разряд — много штатных позиций
  @OneToMany(() => Position, (position) => position.grade)
  positions: Position[];
}

@Entity({
  schema: 'gps',
  name: 'positions',
})
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'position_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  positionCode: string;

  // Связь: одна позиция — много сотрудников
  @OneToMany(() => Employee, (employee) => employee.position)
  employees: Employee[];

  // Связь: много позиций — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.positions)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много позиций — одна профессия
  @ManyToOne(() => Profession, (profession) => profession.positions)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  // Связь: много позиций — один разряд
  @ManyToOne(() => Grade, (grade) => grade.positions)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  // Связь: много позиций — один график
  @ManyToOne(() => Schedule, (schedule) => schedule.positions)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  // Связь: много позиций — одна роль
  @ManyToOne(() => Role, (role) => role.positions)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}

@Entity({
  schema: 'gps',
  name: 'professions',
})
export class Profession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  // Связь: одна профессия — много позиций
  @OneToMany(() => Position, (position) => position.profession)
  positions: Position[];
}

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

  // Связь: одна роль — много штатных позиций
  @OneToMany(() => Position, (position) => position.role)
  positions: Position[];

  // Связь: одна роль — много ролей сотрудника
  @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.role)
  employeeRoles: EmployeeRole[];
}

@Entity({
  schema: 'gps',
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'schedule_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  scheduleCode: string;

  @Column({
    name: 'duration',
    type: 'time', // Для хранения времени без даты
    nullable: false,
  })
  duration: string;

  // Связь: один график — много штатных позиций
  @OneToMany(() => Position, (position) => position.schedule)
  positions: Position[];
}

@Entity({
  schema: 'gps',
  name: 'teams',
})
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'team_number',
    type: 'varchar',
    length: 1,
    nullable: false,
    unique: true,
  })
  teamNumber: string;

  // Новая связь: одна бригада — много работников
  @OneToMany(() => Employee, (employee) => employee.team)
  employees: Employee[];
}

@Entity({
  schema: 'gps',
  name: 'workshops',
})
export class Workshop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'workshop_code',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  workshopCode: string;

  // Связь: один цех — много штатных позиций
  @OneToMany(() => Position, (position) => position.workshop)
  positions: Position[];
}
