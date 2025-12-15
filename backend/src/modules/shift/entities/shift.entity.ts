import { IsDate, IsNumber, IsPositive, Max, Min } from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

import { UserShift } from '../../user-shift/entities/user-shift.entity';
import { Production } from '../../production/entities/production.entity';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { Pack } from '../../pack/entities/pack.entity';
import { Fix } from '../../fix/entities/fix.entity';
import { Residue } from '../../residue/entities/residue.entity';

@Entity({
  schema: 'gps',
  name: 'shifts',
})
@Unique(['date', 'shiftNumber'])
@Unique(['date', 'teamNumber'])
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'date',
    type: 'date',
    nullable: false,
  })
  @IsDate()
  date: Date;

  @Column({
    name: 'shift_number',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(2)
  shiftNumber: number;

  @Column({
    name: 'team_number',
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  teamNumber: number;

  @Column({
    name: 'start_shift',
    type: 'timestamptz',
    nullable: false,
  })
  @IsDate()
  startShift: Date;

  @Column({
    name: 'end_shift',
    type: 'timestamptz',
    nullable: false,
  })
  @IsDate()
  endShift: Date;

  @OneToMany(() => UserShift, (userShift) => userShift.shift, {
    cascade: ['remove'], // Автоматически удалит UserShift при удалении Shift
  })
  usersShifts: UserShift[];

  @OneToMany(() => Production, (production) => production.shift, {
    cascade: ['remove'],
  })
  productions: Production[];

  @OneToMany(() => Shipment, (shipment) => shipment.shift, {
    cascade: ['remove'],
  })
  shipments: Shipment[];

  @OneToMany(() => Pack, (pack) => pack.shift, {
    cascade: ['remove'],
  })
  packs: Pack[];

  @OneToMany(() => Fix, (fix) => fix.shift, {
    cascade: ['remove'],
  })
  fixs: Fix[];

  @OneToMany(() => Residue, (residue) => residue.shift, {
    cascade: ['remove'],
  })
  residues: Pack[];
}
