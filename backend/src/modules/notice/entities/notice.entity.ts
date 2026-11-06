import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticeTitle } from '../../notice-title/entities/notice-title.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Team } from '../../team/entities/team.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

@Entity({
  schema: 'gps',
  name: 'notices',
})
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'source_id',
    type: 'uuid',
    nullable: true,
  })
  sourceId: string | null;

  @Column({
    name: 'source_date',
    type: 'date',
    nullable: true,
  })
  sourceDate: Date | null;

  // Прочитано/непрочитано
  @Column({
    name: 'is_unread',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isUnread: boolean;

  // Выполнено/невыполнено
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

  // Связь: много уведомлений — один заголовок
  @ManyToOne(() => NoticeTitle, (title) => title.notices)
  @JoinColumn({ name: 'notice_title_id' })
  title: NoticeTitle;

  // Связь: много уведомлений — один цех
  @ManyToOne(() => Workshop, (workshop) => workshop.notices)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  // Связь: много уведомлений — одна бригада
  @ManyToOne(() => Team, (team) => team.notices)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  // Связь: много уведомлений — один график
  @ManyToOne(() => Schedule, (schedule) => schedule.notices)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
