import { Injectable, NotFoundException } from '@nestjs/common';

import { ISuccess } from '../../shared/interfaces/api.interface';

import { NoticeRepository } from './notice.repository';
import { NoticeIdDto } from './dto/notice-id.dto';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async markAsReadById(dto: NoticeIdDto): Promise<ISuccess> {
    const notice = await this.noticeRepository.findOneById(dto.id);

    if (!notice) {
      throw new NotFoundException(`Сообщение с ID ${dto.id} не найдено`);
    }

    notice.isUnread = false;
    await this.noticeRepository.save(notice);

    return { message: 'Поле обновлено' };
  }
}
