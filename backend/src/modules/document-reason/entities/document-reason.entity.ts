import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity({
  schema: 'gps',
  name: 'document_reasons',
})
export class DocumentReason {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_reason_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  documentReasonCode: string;

  @Column({
    name: 'document_reason_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  documentReasonName: string;

  // Связь: одна причина документа — много документов
  @OneToMany(() => Document, (document) => document.documentReason)
  documents: Document[];
}
