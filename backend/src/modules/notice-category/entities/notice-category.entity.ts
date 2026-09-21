import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NoticeTitle } from '../../notice-title/entities/notice-title.entity';

@Entity({
  schema: 'gps',
  name: 'notice_categories',
})
export class NoticeCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'category_code',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  categoryCode: string; // 'shift', 'document'

  // Связь: одна категория — много заголовков
  @OneToMany(() => NoticeTitle, (title) => title.category)
  titles: NoticeTitle[];
}
