import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Notice } from '../../notice/entities/notice.entity';
import { Document } from '../../document/entities/document.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { Shift } from '../../shift/entities/shift.entity';

@Entity({
  schema: 'gps',
  name: 'teams',
})
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'team_number',
    type: 'integer',
    nullable: false,
    unique: true,
  })
  teamNumber: number;

  // Связь: одна бригада — много сотрудников
  @OneToMany(() => Employee, (employee) => employee.team)
  employees: Employee[];

  // Связь: одна бригада — много сотрудников (profile бригада)
  @OneToMany(() => Employee, (employee) => employee.profileTeam)
  profileEmployees: Employee[];

  // Связь: одна бригада — много смен
  @OneToMany(() => Shift, (shift) => shift.team)
  shifts: Shift[];

  // Связь: одна бригада — много уведомлений
  @OneToMany(() => Notice, (notice) => notice.team)
  notices: Notice[];

  // Связь: одна бригада — много документов
  @OneToMany(() => Document, (document) => document.team)
  documents: Document[];
}
