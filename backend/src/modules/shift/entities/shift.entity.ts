import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';
import { ShiftSchedule } from '../../shift-schedule/entities/shift-schedule.entity';
import { Team } from '../../team/entities/team.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'shifts',
})
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'date',
    type: 'date',
    nullable: false,
  })
  date: Date;

  // Связь: много смен — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.shifts)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много смен — одна бригада
  @ManyToOne(() => Team, (team) => team.shifts)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: много смен — один тип смены
  @ManyToOne(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.shifts)
  @JoinColumn({ name: 'shift_schedule_id' })
  shiftSchedule: ShiftSchedule;

  // Связь: одна смена — много смен сотрудника
  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.shift)
  employeeShifts: EmployeeShift[];
}
