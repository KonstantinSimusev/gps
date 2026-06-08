import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';

@Entity({
  schema: 'gps',
  name: 'attendance_types',
})
export class AttendanceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'attendance_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  attendanceCode: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  // Связь: один тип посещаемости — много смен сотрудника
  @OneToMany(
    () => EmployeeShift,
    (employeeShift) => employeeShift.attendanceType,
  )
  employeeShifts: EmployeeShift[];
}
