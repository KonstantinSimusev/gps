import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'professions',
})
export class Profession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  // Связь: одна профессия — много позиций
  @OneToMany(() => Position, (position) => position.profession)
  positions: Position[];
}
