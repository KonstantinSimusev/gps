import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Notice } from '../../notice/entities/notice.entity';
import { NoticeAction } from '../../notice-action/entities/notice-action.entity';
import { NoticeCategory } from '../../notice-category/entities/notice-category.entity';
import { NoticeStatus } from '../../notice-status/entities/notice-status.entity';

@Entity({
  schema: 'gps',
  name: 'notice_titles',
})
export class NoticeTitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'title_text',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  titleText: string; // 'Табель', 'Приказ', 'Распоряжение', 'Заявление', 'Акт'

  // Связь: много заголовков — одна категория
  @ManyToOne(() => NoticeCategory, (noticeCategory) => noticeCategory.titles)
  @JoinColumn({ name: 'category_id' })
  category: NoticeCategory;

  // Связь: много заголовков — одно действие
  @ManyToOne(() => NoticeAction, (noticeAction) => noticeAction.titles)
  @JoinColumn({ name: 'action_id' })
  action: NoticeAction;

  // Связь: много заголовков — один статус
  @ManyToOne(() => NoticeStatus, (noticeStatus) => noticeStatus.titles)
  @JoinColumn({ name: 'status_id' })
  status: NoticeStatus;

  // Связь: один заголовок — много уведомлений
  @OneToMany(() => Notice, (notice) => notice.title)
  notices: Notice[];
}
