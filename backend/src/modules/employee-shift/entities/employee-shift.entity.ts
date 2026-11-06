import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { AttendanceType } from '../../attendance-type/entities/attendance-type.entity';
import { Document } from '../../document/entities/document.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { Position } from '../../position/entities/position.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Workplace } from '../../work-place/entities/work-place.entity';

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
  })
  isPresent: boolean | null;

  // Отмеченная смена - выбрано рабочее место, создано распоряжение
  @Column({
    name: 'is_ready',
    type: 'boolean',
    nullable: false,
  })
  isReady: boolean;

  // Связь: много смен сотрудника — один сотрудник
  @ManyToOne(() => Employee, (employee) => employee.employeeShifts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  // Связь: много смен сотрудника — одна смена
  @ManyToOne(() => Shift, (shift) => shift.employeeShifts)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  // Связь: много сотрудников — одна текущая позиция
  @ManyToOne(() => Position, (position) => position.employeeShifts)
  @JoinColumn({ name: 'current_position_id' })
  currentPosition: Position;

  // Связь: много смен сотрудника — один тип посещаемости
  @ManyToOne(
    () => AttendanceType,
    (attendanceType) => attendanceType.employeeShifts,
  )
  @JoinColumn({ name: 'attendance_type_id' })
  attendanceType: AttendanceType;

  // Связь: много смен сотрудника — одно рабочее место
  @ManyToOne(() => Workplace, (workplace) => workplace.employeeShifts)
  @JoinColumn({ name: 'work_place_id' })
  workplace: Workplace | null;

  // Связь: много смен сотрудника — один документ
  @ManyToOne(() => Document, (document) => document.employeeShifts)
  @JoinColumn({ name: 'document_id' })
  document: Document | null;
}
