import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Position } from '../../positions/entities/position.entity';

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
