import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { ShiftSchedule } from '../../shift-schedule/entities/shift-schedule.entity';
import { WorkPlace } from '../../work-place/entities/work-place.entity';

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

  // Связь: один цех — много смен
  @OneToMany(() => Shift, (shift) => shift.workshop)
  shifts: Shift[];

  // Связь: один цех — много расписаний смен
  @OneToMany(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.workshop)
  shiftSchedules: ShiftSchedule[];

  // Связь: один цех — много рабочих мест
  @OneToMany(() => WorkPlace, (workPlace) => workPlace.workshop)
  workPlaces: WorkPlace[];
}
