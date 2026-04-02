import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Employee } from '../../employees/entities/employee.entity';
import { Workshop } from '../../workshops/entities/workshop.entity';
import { Profession } from '../../professions/entities/profession.entity';
import { Grade } from '../../grades/entities/grade.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Role } from '../../roles/entities/role.entity';

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
