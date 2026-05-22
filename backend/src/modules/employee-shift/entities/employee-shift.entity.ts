// import {
//   Column,
//   Entity,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';

// import { Employee } from '../../employee/entities/employee.entity';
// import { Shift } from '../../shift/entities/shift.entity';
// import { AttendanceType } from 'src/modules/attendance-type/entities/attendance-type.entity';

// @Entity({
//   schema: 'gps',
//   name: 'employee_shifts',
// })
// export class EmployeeShift {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({
//     name: 'area',
//     type: 'varchar',
//     length: 255,
//     nullable: false,
//   })
//   area: string;

//   @Column({
//     name: 'hours',
//     type: 'decimal',
//     precision: 4,
//     scale: 1,
//     nullable: false,
//   })
//   hours: number;

//   // Связь: много смен сотрудника — один сотрудник
//   @ManyToOne(() => Employee, (employee) => employee.employeeShifts)
//   @JoinColumn({ name: 'employee_id' })
//   employee: Employee;

//   // Связь: много смен сотрудника — одна смена
//   @ManyToOne(() => Shift, (shift) => shift.employeeShifts)
//   @JoinColumn({ name: 'shift_id' })
//   shift: Shift;

//   // Связь: много смен сотрудника — одна посещаемость
//   @ManyToOne(
//     () => AttendanceType,
//     (attendanceType) => attendanceType.employeeShifts,
//   )
//   @JoinColumn({ name: 'attendance_type_id' })
//   attendanceType: AttendanceType;
// }
