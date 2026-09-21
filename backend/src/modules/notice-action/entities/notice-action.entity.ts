import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NoticeTitle } from '../../notice-title/entities/notice-title.entity';

@Entity({
  schema: 'gps',
  name: 'notice_actions',
})
export class NoticeAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'action_code',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  actionCode: string; // 'create', 'fill', 'sign'

  @Column({
    name: 'action_label',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  actionLabel: string; // 'Создать смену', 'Заполнить смену', 'Подписать документ'

  // Связь: одно действие  — много заголовков
  @OneToMany(() => NoticeTitle, (title) => title.action)
  titles: NoticeTitle[];
}
