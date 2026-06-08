import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { AttendanceType } from '../../attendance-type/entities/attendance-type.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { Profession } from '../../profession/entities/profession.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { WorkPlace } from '../../work-place/entities/work-place.entity';

@Entity({
  schema: 'gps',
  name: 'employee_shifts',
})
export class EmployeeShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'hours',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: false,
  })
  hours: number;

  // Связь: много смен сотрудника — один сотрудник
  @ManyToOne(() => Employee, (employee) => employee.employeeShifts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  // Связь: много смен сотрудника — одна смена
  @ManyToOne(() => Shift, (shift) => shift.employeeShifts)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  // Связь: много смен сотрудника — один тип посещаемости
  @ManyToOne(
    () => AttendanceType,
    (attendanceType) => attendanceType.employeeShifts,
  )
  @JoinColumn({ name: 'attendance_type_id' })
  attendanceType: AttendanceType;

  // Связь: много смен сотрудника — одна текущая профессия
  @ManyToOne(
    () => Profession,
    (currentProfession) => currentProfession.employeeShifts,
  )
  @JoinColumn({ name: 'current_profession_id' })
  currentProfession: Profession;

  // Связь: много смен сотрудника — одно рабочее место
  @ManyToOne(() => WorkPlace, (workPlace) => workPlace.employeeShifts)
  @JoinColumn({ name: 'work_place_id' })
  workPlace: WorkPlace;
}
