import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ShiftSchedule } from '../../shift-schedule/entities/shift-schedule.entity';

@Entity({ name: 'shift_types' })
export class ShiftType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'category',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  category: string;

  // Связь: один тип смены — много расписаний
  @OneToMany(() => ShiftSchedule, (shiftSchedule) => shiftSchedule.shiftType)
  shiftSchedules: ShiftSchedule[];
}
