import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { NoticeTitle } from '../../notice-title/entities/notice-title.entity';

@Entity({
  schema: 'gps',
  name: 'notices',
})
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'is_unread',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isUnread: boolean;

  @Column({
    name: 'is_resolved',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isResolved: boolean;

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

  // Связь: много уведомлений — одна категория
  @ManyToOne(() => NoticeTitle, (title) => title.notices)
  @JoinColumn({ name: 'notice_title_id' })
  title: NoticeTitle;
}
