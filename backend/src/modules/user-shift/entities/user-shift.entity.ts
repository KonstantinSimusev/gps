import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Shift } from '../../shift/entities/shift.entity';

@Entity({
  schema: 'gps',
  name: 'users_shifts',
})
@Unique(['user', 'shift'])
export class UserShift {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({
    name: 'work_status',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsString()
  workStatus: string;

  @Column({
    name: 'work_place',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsString()
  workPlace: string;

  @Column({
    name: 'shift_profession',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  shiftProfession: string;

  @Column({
    name: 'work_hours',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: false,
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  workHours: number;

  @ManyToOne(() => User, (user) => user.shifts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Shift, (shift) => shift.usersShifts)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;
}
