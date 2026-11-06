import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity({
  schema: 'gps',
  name: 'document_titles',
})
export class DocumentTitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'document_title_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  documentTitleCode: string;

  @Column({
    name: 'document_title_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  documentTitleName: string;

  // Связь: один заголовок документа — много документов
  @OneToMany(() => Document, (document) => document.documentTitle)
  documents: Document[];
}
