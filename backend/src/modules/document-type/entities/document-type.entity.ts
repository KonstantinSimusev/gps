import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity({
  schema: 'gps',
  name: 'document_types',
})
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_type_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  documentTypeCode: string;

  @Column({
    name: 'document_type_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  documentTypeName: string;

  // Связь: один тип документа — много документов
  @OneToMany(() => Document, (document) => document.documentType)
  documents: Document[];
}
