import {
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Shift } from '../../shift/entities/shift.entity';

import { EArea, ELocation } from '../../../shared/enums/enums';

@Entity({
  schema: 'gps',
  name: 'residues',
})
export class Residue {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({
    name: 'location',
    type: 'enum',
    enum: ELocation,
    nullable: false,
  })
  @IsString()
  location: ELocation;

  @Column({
    name: 'area',
    type: 'enum',
    enum: EArea,
    nullable: false,
  })
  @IsString()
  area: EArea;

  @Column({
    name: 'count',
    type: 'integer',
    nullable: false,
  })
  @Min(0)
  @Max(1000)
  @IsNumber()
  count: number;

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

  @ManyToOne(() => Shift, (shift) => shift.residues)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;
}
