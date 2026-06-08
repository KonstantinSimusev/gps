import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';
import { Position } from '../../position/entities/position.entity';
import { WorkPlace } from '../../work-place/entities/work-place.entity';

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

  // Связь: одна профессия — много смен работника
  @OneToMany(
    () => EmployeeShift,
    (employeeShift) => employeeShift.currentProfession,
  )
  employeeShifts: EmployeeShift[];

  // Связь: одна профессия — много позиций
  @OneToMany(() => Position, (position) => position.profession)
  positions: Position[];

  // Связь: одна профессия — много рабочих мест
  @OneToMany(() => WorkPlace, (workPlace) => workPlace.profession)
  workPlaces: WorkPlace[];
}
