import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';
import { ShiftSchedule } from '../../shift-schedule/entities/shift-schedule.entity';

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

  // Связь: один график — много расписаний смен
  @OneToMany(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.schedule)
  shiftSchedules: ShiftSchedule[];
}
