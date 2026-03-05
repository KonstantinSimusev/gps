import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Position } from '../../positions/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'grades',
})
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'grade_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  gradeCode: string;

  // Связь: один разряд — много штатных позиций
  @OneToMany(() => Position, (position) => position.grade)
  positions: Position[];
}
