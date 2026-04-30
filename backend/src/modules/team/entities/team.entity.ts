import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Employee } from '../../employee/entities/employee.entity';

@Entity({
  schema: 'gps',
  name: 'teams',
})
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'team_number',
    type: 'varchar',
    length: 1,
    nullable: false,
    unique: true,
  })
  teamNumber: string;

  // Новая связь: одна бригада — много работников
  @OneToMany(() => Employee, (employee) => employee.team)
  employees: Employee[];
}
