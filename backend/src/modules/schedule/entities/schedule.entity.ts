import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Document } from '../../document/entities/document.entity';
import { Notice } from '../../notice/entities/notice.entity';
import { Position } from '../../position/entities/position.entity';
import { Shift } from '../../shift/entities/shift.entity';
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

  // Связь: один график — много штатных позиций
  @OneToMany(() => Position, (position) => position.schedule)
  positions: Position[];

  // Связь: один график — много расписаний смен
  @OneToMany(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.schedule)
  shiftSchedules: ShiftSchedule[];

  // Связь: один график — много смен
  @OneToMany(() => Shift, (shift) => shift.schedule)
  shifts: Shift[];

  // Связь: один график — много уведомлений
  @OneToMany(() => Notice, (notice) => notice.schedule)
  notices: Notice[];

  // Связь: один график — много документов
  @OneToMany(() => Document, (document) => document.schedule)
  documents: Document[];
}
