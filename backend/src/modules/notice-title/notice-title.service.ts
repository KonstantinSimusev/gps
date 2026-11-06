import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  ENoticeAction,
  ENoticeCategory,
  ENoticeStatus,
} from '../../shared/enums/enums';

import { NoticeTitle } from './entities/notice-title.entity';
import { NoticeTitleRepository } from './notice-title.repository';

@Injectable()
export class NoticeTitleService {
  constructor(private readonly noticeTitleRepository: NoticeTitleRepository) {}

  async getTitle(
    categoryCode: string,
    actionCode: string,
    statusLabel: string,
  ): Promise<NoticeTitle> {
    const noticeTitle = await this.noticeTitleRepository.findByCriteria(
      categoryCode,
      actionCode,
      statusLabel,
    );

    if (!noticeTitle) {
      throw new NotFoundException('Заголовок не найден');
    }

    return noticeTitle;
  }

  // async markAsReadById(dto: NoticeIdDto): Promise<ISuccess> {
  //   const notice = await this.noticeRepository.findOneById(dto.id);

  //   if (!notice) {
  //     throw new NotFoundException(`Сообщение с ID ${dto.id} не найдено`);
  //   }

  //   notice.isUnread = false;
  //   await this.noticeRepository.save(notice);

  //   return { message: 'Поле обновлено' };
  // }

  // 'НУЖНА ЛОГИКА!!!'
  // private mapToINotice(notice: Notice): INotice {
  //   let itemId = '';
  //   let title = '';

  // 'НУЖНА ЛОГИКА!!!'
  // if (notice.categoryCode === 'shift' && notice.shift) {
  //   itemId = notice.shift.id;
  //   title = `${ENoticeTitle.TIMESHEET} от ${new Date(notice.shift.date).toLocaleDateString('ru-RU')}`;
  // }
  // else if (notice.category.code === 'document' && notice.documentId) {
  //   itemId = notice.documentId;
  //   title = 'Документ';
  // }

  //   return {
  //     id: notice.id,
  //     categoryCode: notice.title.category.categoryCode,
  //     titleText: notice.title.titleText,
  //     statusLabel: notice.title.status.statusLabel,
  //     actionCode: notice.title.action.actionCode,
  //     actionLabel: notice.title.action.actionLabel,
  //     isUnread: notice.isUnread,
  //     isResolved: notice.isResolved,
  //     createdAt: notice.createdAt.toISOString(),
  //     updatedAt: notice.updatedAt.toISOString(),
  //   };
  // }
}
