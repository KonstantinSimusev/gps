import { QueryFailedError } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { mapNotice } from '../../shared/utils/utils';

import {
  INotice,
  IProfile,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import {
  ENoticeCategory,
  ENoticeAction,
  ENoticeStatus,
} from '../../shared/enums/enums';

import { NoticeRepository } from '../notice/notice.repository';
import { NoticeService } from '../notice/notice.service';
import { NoticeTitleService } from '../notice-title/notice-title.service';
import { ShiftManagementService } from '../shift-management/shift-management.service';
import { ScheduleService } from '../schedule/schedule.service';
import { TeamService } from '../team/team.service';
import { WorkshopService } from '../workshop/workshop.service';

@Injectable()
export class NoticeManagementService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly noticeService: NoticeService,
    private readonly noticeTitleService: NoticeTitleService,
    private readonly scheduleService: ScheduleService,
    private readonly shiftManagementService: ShiftManagementService,
    private readonly teamService: TeamService,
    private readonly workshopService: WorkshopService,
  ) {}

  // ДОБАВЛЕНЫ current-поля в IProfile!!!
  async getNoticesWithAutoCreate(profile: IProfile): Promise<INotice[]> {
    let notices = await this.getNotices(profile);

    if (notices.length === 0) {
      // ЛОГИКА!!!
      // await this.createShifts(profile);
      // shifts = await this.getShifts(profile);
    }

    return notices;
  }

  async createNoticeForDocument(
    employeeShiftSourceId: string,
    profileWorkshopCode: string,
    profileTeamNumber: number,
    profileScheduleCode: string,
    noticeCategoryCode: string, // 'shift', 'document'
    noticeActionCode: string, // 'create', 'fill', 'sign' ('Создать смену', 'Заполнить смену', 'Подписать документ')
    noticeStatusLabel: string, // 'Смена не создана', 'Смена не заполнена', 'Документ не подписан'
  ): Promise<ISuccess> {
    const [workshop, team, schedule] = await Promise.all([
      this.workshopService.getWorkshop(profileWorkshopCode),
      this.teamService.getTeam(profileTeamNumber),
      this.scheduleService.getScheduleByCode(profileScheduleCode),
    ]);

    const noticeTitle = await this.noticeTitleService.getTitle(
      noticeCategoryCode,
      noticeActionCode,
      noticeStatusLabel,
    );

    await this.noticeService.checkNoticeBySourceIdExists(
      employeeShiftSourceId,
      noticeTitle.id,
      workshop.id,
      team.id,
      schedule.id,
    );

    return {
      message: 'Уведомление создано успешно',
    };
  }

  // ДОБАВЛЕНЫ current-поля в IProfile!!!
  // async createMissingShiftNotices(profile: IProfile): Promise<ISuccess> {
  //   const { workshopCode, teamNumber, scheduleCode } = profile;

  //   // Получаем даты отсутствующих смен
  //   const missingShifts =
  //     await this.shiftManagementService.getMissingShiftsDates(profile);

  //   if (missingShifts.length === 0) {
  //     return { message: 'Отсутствующих смен нет' };
  //   }

  //   const shiftCreateTitle = await this.noticeTitleService.getTitle(
  //     ENoticeCategory.SHIFT,
  //     ENoticeAction.CREATE,
  //     ENoticeStatus.NOT_CREATED,
  //   );

  //   const [workshop, team, schedule] = await Promise.all([
  //     this.workshopService.getWorkshop(workshopCode),
  //     this.teamService.getTeam(teamNumber),
  //     this.scheduleService.getScheduleByCode(scheduleCode),
  //   ]);

  //   let createdCount = 0;

  //   for (const sourceDate of missingShifts) {
  //     try {
  //       const existsCount =
  //         await this.noticeService.checkNoticeBySourceDateExists(
  //           sourceDate,
  //           shiftCreateTitle.id,
  //           workshop.id,
  //           team.id,
  //           schedule.id,
  //         );

  //       if (existsCount > 0) {
  //         continue;
  //       }

  //       await this.noticeRepository.create({
  //         sourceDate: new Date(sourceDate),
  //         title: shiftCreateTitle,
  //         workshop,
  //         team,
  //         schedule,
  //       });

  //       createdCount++;
  //     } catch (error) {
  //       this.handleNoticeError(error);
  //     }
  //   }

  //   return {
  //     message:
  //       createdCount === 0
  //         ? 'Уведомления уже созданы'
  //         : `Создано уведомлений об отсутствующих сменах: ${createdCount}.`,
  //   };
  // }

  // ДОБАВЛЕНЫ current-поля в IProfile!!!
  async createPendingShiftNotices(profile: IProfile): Promise<ISuccess> {
    const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
      profile;

    const pendingShiftIds =
      await this.shiftManagementService.getPendingShiftsIds(profile);

    if (pendingShiftIds.length === 0) {
      return { message: 'Незаполненных смен нет' };
    }

    const shiftPendingTitle = await this.noticeTitleService.getTitle(
      ENoticeCategory.SHIFT,
      ENoticeAction.FILL,
      ENoticeStatus.NOT_FILLED,
    );

    const [workshop, team, schedule] = await Promise.all([
      this.workshopService.getWorkshop(profileWorkshopCode),
      this.teamService.getTeam(profileTeamNumber),
      this.scheduleService.getScheduleByCode(profileScheduleCode),
    ]);

    let createdCount = 0;

    for (const sourceId of pendingShiftIds) {
      try {
        const existsCount =
          await this.noticeService.checkNoticeBySourceIdExists(
            sourceId,
            shiftPendingTitle.id,
            workshop.id,
            team.id,
            schedule.id,
          );

        if (existsCount > 0) {
          continue;
        }

        await this.noticeRepository.create({
          sourceId,
          title: shiftPendingTitle,
          workshop,
          team,
          schedule,
        });

        createdCount++;
      } catch (error) {
        // Unique violation (гонка от StrictMode) — пропускаем
        if (
          error instanceof QueryFailedError &&
          (error.message.includes('duplicate key') ||
            error.message.includes('unique constraint'))
        ) {
          continue;
        }
        this.handleNoticeError(error);
      }
    }

    return {
      message:
        createdCount === 0
          ? 'Уведомления уже существуют или не требуются.'
          : `Создано уведомлений о незаполненных сменах: ${createdCount}.`,
    };
  }

  // async createDocumnentsNotices(profile: IProfile): Promise<ISuccess> {
  //   const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
  //     profile;

  // }

  // ДОБАВЛЕНЫ current-поля в IProfile!!!
  async getNotices(profile: IProfile): Promise<INotice[]> {
    const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
      profile;

    // Получаем связанные справочники (цех, бригада, график)
    // Параллельная загрузка справочников — лучшая практика для независимых запросов
    const [workshop, team, schedule] = await Promise.all([
      this.workshopService.getWorkshop(profileWorkshopCode),
      this.teamService.getTeam(profileTeamNumber),
      this.scheduleService.getScheduleByCode(profileScheduleCode),
    ]);

    const notices = await this.noticeRepository.findAllUnresolved(
      workshop.id,
      team.id,
      schedule.id,
    );

    if (notices.length === 0) {
      return [];
    }

    return notices.map((notice) => mapNotice(notice));
  }

  private handleNoticeError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      // Проверяем, похоже ли на нарушение уникального ограничения (частая причина «Смена уже создана»)
      const isUniqueViolation =
        error.message.includes('duplicate key') ||
        error.message.includes('unique constraint') ||
        error.message.includes('already exists');

      if (isUniqueViolation) {
        // return { message: 'Смена уже создана' };
        throw new ConflictException('Уведомление уже создано');
      }

      // Если это QueryFailedError, но не про уникальность — лучше пробросить как конфликт или серверную ошибку
      throw new ConflictException(
        'Не удалось создать уведомление: конфликт данных',
      );
    }

    // Для всех остальных ошибок — стандартная серверная ошибка
    throw new InternalServerErrorException(
      `Не удалось создать уведомление: ${error}`,
    );
  }
}
