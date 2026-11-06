import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentAction } from '../../document-action/entities/document-action.entity';
import { DocumentReason } from '../../document-reason/entities/document-reason.entity';
import { DocumentTitle } from '../../document-title/entities/document-title.entity';
import { DocumentType } from '../../document-type/entities/document-type.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { EmployeeShift } from '../../employee-shift/entities/employee-shift.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Team } from '../../team/entities/team.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'documents',
})
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_start_date',
    type: 'date',
    nullable: false,
  })
  documentStartDate: Date;

  @Column({
    name: 'document_end_date',
    type: 'date',
    nullable: false,
  })
  documentEndDate: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  // Связь: много документов — один тип документа
  @ManyToOne(() => DocumentType, (documentType) => documentType.documents)
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentType;

  // Связь: много документов — один заголовок документа
  @ManyToOne(() => DocumentTitle, (documentTitle) => documentTitle.documents)
  @JoinColumn({ name: 'document_title_id' })
  documentTitle: DocumentTitle;

  // Связь: много документов — одна причина документа
  @ManyToOne(() => DocumentReason, (documentReason) => documentReason.documents)
  @JoinColumn({ name: 'document_reason_id' })
  documentReason: DocumentReason;

  // Связь: много документов — одно действие документа
  @ManyToOne(() => DocumentAction, (documentAction) => documentAction.documents)
  @JoinColumn({ name: 'document_action_id' })
  documentAction: DocumentAction;

  // Связь: много документов — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.documents)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много документов — одна бригада
  @ManyToOne(() => Team, (team) => team.documents)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: много документов — один график
  @ManyToOne(() => Schedule, (schedule) => schedule.documents)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  // Связь: много документов — один отсутствующий сотрудник
  @ManyToOne(() => Employee, (employee) => employee.documents)
  @JoinColumn({ name: 'absent_employee_id' })
  absentEmployee: Employee | null;

  // Связь: один документ — много смен работников
  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.document)
  employeeShifts: EmployeeShift[];
}
