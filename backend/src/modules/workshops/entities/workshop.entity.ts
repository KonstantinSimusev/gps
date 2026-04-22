import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../positions/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'workshops',
})
export class Workshop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'workshop_code',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  workshopCode: string;

  // Связь: один цех — много штатных позиций
  @OneToMany(() => Position, (position) => position.workshop)
  positions: Position[];
}
