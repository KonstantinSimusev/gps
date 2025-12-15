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

import { ELocation, ERailway } from '../../../shared/enums/enums';

@Entity({
  schema: 'gps',
  name: 'shipments',
})
export class Shipment {
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
    name: 'railway',
    type: 'enum',
    enum: ERailway,
    nullable: false,
  })
  @IsString()
  railway: ERailway;

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

  @ManyToOne(() => Shift, (shift) => shift.shipments)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;
}
