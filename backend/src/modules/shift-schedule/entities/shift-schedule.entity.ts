import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Schedule } from '../../schedule/entities/schedule.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { ShiftType } from '../../shift-type/entities/shift-type.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'shift_schedules',
})
export class ShiftSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'start_time',
    type: 'time',
    nullable: false,
  })
  startTime: string;

  @Column({
    name: 'end_time',
    type: 'time',
    nullable: false,
  })
  endTime: string;

  // Связь: много расписаний смен - один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.shiftSchedules)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много расписаний смен - один график
  @ManyToOne(() => Schedule, (schedule) => schedule.shiftSchedules)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  // Связь: много расписаний смен — один тип смены
  @ManyToOne(() => ShiftType, (shiftType) => shiftType.shiftSchedules)
  @JoinColumn({ name: 'shift_type_id' })
  shiftType: ShiftType;

  // Связь: одно расписание смены — много смен
  @OneToMany(() => Shift, (shift) => shift.shiftSchedule)
  shifts: Shift[];
}
