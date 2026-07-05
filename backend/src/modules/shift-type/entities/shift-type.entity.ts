import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ShiftSchedule } from '../../shift-schedule/entities/shift-schedule.entity';

@Entity({
  schema: 'gps',
  name: 'shift_types',
})
export class ShiftType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'shift_code',
    type: 'integer',
    nullable: false,
    unique: true,
  })
  shiftCode: number;

  // Связь: один тип смены — много расписаний смен
  @OneToMany(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.shiftType)
  shiftSchedules: ShiftSchedule[];
}