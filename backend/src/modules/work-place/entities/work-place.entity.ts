import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';
import { Profession } from '../../profession/entities/profession.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'work_places',
})
export class WorkPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  // Связь: много рабочих мест — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.workPlaces)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много рабочих мест — одна профессия
  @ManyToOne(() => Profession, (profession) => profession.workPlaces)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  // Связь: одно рабочее место — много смен сотрудника
  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.workPlace)
  employeeShifts: EmployeeShift[];
}
