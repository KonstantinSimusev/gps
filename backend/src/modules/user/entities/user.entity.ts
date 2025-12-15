import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { UserShift } from '../../user-shift/entities/user-shift.entity';

import { EProfession, ERole } from '../../../shared/enums/enums';

@Entity({
  schema: 'gps',
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'position_code',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(9999999999)
  positionCode: number;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'patronymic',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  patronymic: string;

  @Column({
    name: 'profession',
    type: 'enum',
    enum: EProfession,
    nullable: false,
  })
  profession: EProfession;

  @Column({
    name: 'grade',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(20)
  grade: number;

  @Column({
    name: 'personal_number',
    type: 'integer',
    nullable: false,
    unique: true,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(9999999999)
  personalNumber: number;

  @Column({
    name: 'team_number',
    type: 'integer',
    nullable: false,
  })
  @Min(1)
  @Max(5)
  @IsNumber()
  @IsPositive()
  teamNumber: number;

  @Column({
    name: 'current_team_number',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  currentTeamNumber: number;

  @Column({
    name: 'work_schedule',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  workSchedule: string;

  @Column({
    name: 'workshop_code',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  workshopCode: string;

  @Column({
    name: 'login',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    name: 'hashed_password',
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  hashedPassword: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  refreshToken: string | null;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ERole,
    nullable: false,
  })
  role: ERole;

  @Column({
    name: 'sort_order',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(20)
  sortOrder: number;

  @OneToMany(() => UserShift, (userShift) => userShift.user)
  shifts: UserShift[];
}
