// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// import { Employee } from '../../employee/entities/employee.entity';
// import { Workshop } from '../../workshop/entities/workshop.entity';
// import { Profession } from '../../profession/entities/profession.entity';
// import { Grade } from '../../grade/entities/grade.entity';
// import { Role } from '../../role/entities/role.entity';
// import { Schedule } from '../../schedule/entities/schedule.entity';
// import { Team } from '../../team/entities/team.entity';
// import { Position } from '../../position/entities/position.entity';

// @Entity({
//   schema: 'gps',
//   name: 'employee_transfers',
// })
// export class EmployeeTransfer {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({
//     name: 'position_start_date',
//     type: 'date',
//     nullable: false,
//   })
//   positionStartDate: Date;

//   @Column({
//     name: 'position_end_date',
//     type: 'date',
//     nullable: false,
//   })
//   positionEndDate: Date;

//   // Связь: много переводов сотрудников — одна текущая бригада
//   @ManyToOne(() => Team, (currentTeam) => currentTeam.employeeTransfers)
//   @JoinColumn({ name: 'current_team_id' })
//   currentTeam: Team;

//   // Связь: много переводов сотрудников — одна текущая позиция
//   @ManyToOne(
//     () => Position,
//     (currentPosition) => currentPosition.employeeTransfers,
//   )
//   @JoinColumn({ name: 'current_position_id' })
//   currentPosition: Position;

//   // Связь: много позиций — один разряд
//   @ManyToOne(() => Grade, (grade) => grade.positions)
//   @JoinColumn({ name: 'grade_id' })
//   grade: Grade;

//   // Связь: много позиций — один график
//   @ManyToOne(() => Schedule, (schedule) => schedule.positions)
//   @JoinColumn({ name: 'schedule_id' })
//   schedule: Schedule;

//   // Связь: много позиций — одна роль
//   @ManyToOne(() => Role, (role) => role.positions)
//   @JoinColumn({ name: 'role_id' })
//   role: Role;

//   // Связь: одна позиция — много сотрудников
//   @OneToMany(() => Employee, (employee) => employee.position)
//   employees: Employee[];
// }
