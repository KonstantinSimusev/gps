import { Max, Min } from 'class-validator';

import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({
  schema: 'gps',
  name: 'shifts',
})
@Unique(['workshopCode', 'date', 'shiftNumber'])
@Unique(['workshopCode', 'date', 'teamNumber'])
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'workshop_code',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  workshopCode: string;

  @Column({
    name: 'date',
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    name: 'shift_number',
    type: 'integer',
    nullable: false,
  })
  @Min(1)
  @Max(2)
  shiftNumber: number;

  @Column({
    name: 'team_number',
    type: 'integer',
    nullable: false,
  })
  @Min(1)
  @Max(5)
  teamNumber: number;
}
