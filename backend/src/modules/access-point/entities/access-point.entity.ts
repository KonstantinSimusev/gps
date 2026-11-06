import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'access_points',
})
export class AccessPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'point_code',
    type: 'integer',
    nullable: false,
  })
  pointCode: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'entry_time',
    type: 'integer',
    nullable: true,
  })
  entryTime: number;

  @Column({
    name: 'exit_time',
    type: 'integer',
    nullable: true,
  })
  exitTime: number;

  // Связь: много КПП — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.accessPoints)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;
}
