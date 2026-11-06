import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity({
  schema: 'gps',
  name: 'document_actions',
})
export class DocumentAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_action_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  documentActionCode: string;

  @Column({
    name: 'document_action_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  documentActionName: string;

  // Связь: одно действие документа — много документов
  @OneToMany(() => Document, (document) => document.documentAction)
  documents: Document[];
}
