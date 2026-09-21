import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NoticeTitle } from '../../notice-title/entities/notice-title.entity';

@Entity({
  schema: 'gps',
  name: 'notice_statuses',
})
export class NoticeStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'status_label',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  statusLabel: string; // 'Смена не создана', 'Смена не заполнена', 'Документ не подписан'

  // Связь: одна категория — много заголовков
  @OneToMany(() => NoticeTitle, (title) => title.status)
  titles: NoticeTitle[];
}
