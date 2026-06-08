// import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// import { EmployeeTransfer } from '../../employee-transfer/entities/employee-transfer.entity';

// @Entity({
//   schema: 'gps',
//   name: 'transfer_reasons',
// })
// export class TransferReason {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({
//     name: 'name',
//     type: 'varchar',
//     length: 255,
//     nullable: false,
//   })
//   name: string;

//   // Связь: одна причина перевода — много переводов сотрудников
//   @OneToMany(() => EmployeeTransfer, (employeeTransfers) => position.grade)
//   employeeTransfers: EmployeeTransfer[];
// }
