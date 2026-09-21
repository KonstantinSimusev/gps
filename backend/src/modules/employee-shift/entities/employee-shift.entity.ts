import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { AttendanceType } from '../../attendance-type/entities/attendance-type.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { Position } from 'src/modules/position/entities/position.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { WorkPlace } from '../../work-place/entities/work-place.entity';

@Entity({
  schema: 'gps',
  name: 'employee_shifts',
})
export class EmployeeShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Отработанное время в минутах
  @Column({
    name: 'minutes',
    type: 'integer',
    nullable: false,
  })
  minutes: number;

  // Посещение сменно-встечных собраний
  @Column({
    name: 'is_present',
    type: 'boolean',
    nullable: true,
    default: true,
  })
  isPresent: boolean | null;

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

  // Связь: много смен сотрудника — одна текущая позиция
  @ManyToOne(
    () => Position,
    (currentPosition) => currentPosition.employeeShifts,
  )
  @JoinColumn({ name: 'current_position_id' })
  currentPosition: Position;

  // Связь: много смен сотрудника — одно рабочее место
  @ManyToOne(() => WorkPlace, (workPlace) => workPlace.employeeShifts)
  @JoinColumn({ name: 'work_place_id' })
  workPlace: WorkPlace | null;
}
