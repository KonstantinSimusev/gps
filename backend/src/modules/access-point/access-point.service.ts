// import { Injectable, NotFoundException } from '@nestjs/common';

// import { mapNotice } from '../../shared/utils/utils';
// import { INotice, ISuccess } from '../../shared/interfaces/api.interface';

// import { NoticeIdDto } from './dto/notice-id.dto';
// import { NoticeRepository } from './access-point.repository';

// @Injectable()
// export class NoticeService {
//   constructor(private readonly noticeRepository: NoticeRepository) {}

//   async getNoticeById(dto: NoticeIdDto): Promise<INotice> {
//     const notice = await this.noticeRepository.findOneById(dto.id);

//     if (!notice) {
//       throw new NotFoundException(`Уведомление с ID ${dto.id} не найдено`);
//     }

//     return mapNotice(notice);
//   }

//   async checkNoticeBySourceDateExists(
//     sourceDate: string,
//     titleId: string,
//     workshopId: string,
//     teamId: string,
//     scheduleId: string,
//   ): Promise<number> {
//     const date = new Date(sourceDate);
//     date.setUTCHours(0, 0, 0, 0);

//     return this.noticeRepository.countBySourceDate(
//       date,
//       titleId,
//       workshopId,
//       teamId,
//       scheduleId,
//     );
//   }

//   async checkNoticeBySourceIdExists(
//     sourceId: string,
//     titleId: string,
//     workshopId: string,
//     teamId: string,
//     scheduleId: string,
//   ): Promise<number> {
//     return this.noticeRepository.countBySourceId(
//       sourceId,
//       titleId,
//       workshopId,
//       teamId,
//       scheduleId,
//     );
//   }

//   async markNoticeAsRead(dto: NoticeIdDto): Promise<ISuccess> {
//     const notice = await this.noticeRepository.findOneById(dto.id);

//     if (!notice) {
//       throw new NotFoundException(`Сообщение с ID ${dto.id} не найдено`);
//     }

//     notice.isUnread = false;
//     await this.noticeRepository.save(notice);

//     return { message: 'Поле обновлено' };
//   }
// }
