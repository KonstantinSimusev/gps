import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'grades',
})
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'grade_code',
    type: 'integer',
    nullable: false,
    unique: true,
  })
  gradeCode: number;

  // Связь: один разряд — много штатных позиций
  @OneToMany(() => Position, (position) => position.grade)
  positions: Position[];
}
