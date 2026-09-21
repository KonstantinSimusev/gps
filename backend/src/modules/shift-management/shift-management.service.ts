import { QueryFailedError } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  calcShiftDuration,
  getShiftFor2A,
  getShiftFor5B1,
  getShiftFor9,
  getUTC,
  getUTCDateString,
  getUTCToday,
  getUTCTomorrow,
  getUTCYesterday,
} from '../../shared/utils/utils';

import { ShiftDateDto } from './dto/shift-date.dto';

import {
  EAttendanceCode,
  ENoticeActionLabel,
  ENoticeStatus,
  ESchedule,
  EWorkshop,
} from '../../shared/enums/enums';

import {
  IMessage,
  IProfile,
  IShift,
  ISuccess,
  IShiftInfo,
} from '../../shared/interfaces/api.interface';

import { AttendanceType } from '../attendance-type/entities/attendance-type.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Notice } from '../notice/entities/notice.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Team } from '../team/entities/team.entity';
import { Workshop } from '../workshop/entities/workshop.entity';

import { EmployeeShiftRepository } from '../employee-shift/employee-shift.repository';
import { ShiftRepository } from '../shift/shift.repository';

import { AttendanceTypeService } from '../attendance-type/attendance-type.service';
import { EmployeeService } from '../employee/employee.service';
import { NoticeService } from '../notice/notice.service';
import { ScheduleService } from '../schedule/schedule.service';
import { ShiftScheduleService } from '../shift-schedule/shift-schedule.service';
import { ShiftService } from '../shift/shift.service';
import { TeamService } from '../team/team.service';
import { WorkshopService } from '../workshop/workshop.service';
import { ShiftIdDto } from './dto/shift-id.dto';

@Injectable()
export class ShiftManagementService {
  constructor(
    private readonly employeeShiftRepository: EmployeeShiftRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly attendanceTypeService: AttendanceTypeService,
    private readonly employeeService: EmployeeService,
    private readonly noticeService: NoticeService,
    private readonly scheduleService: ScheduleService,
    private readonly shiftScheduleService: ShiftScheduleService,
    private readonly shiftService: ShiftService,
    private readonly teamService: TeamService,
    private readonly workshopService: WorkshopService,
  ) {}

  async createShifts(
    profile: IProfile,
    baseDate: Date | null = null,
  ): Promise<ISuccess> {
    const strategies = this.getShiftStrategies(profile, baseDate);

    if (strategies.length === 0) {
      return {
        message: 'Нет стратегий',
      };
    }

    for (const strategy of strategies) {
      await strategy(profile);
    }

    return {
      message: 'Смены созданы успешно',
    };
  }

  async getShifts(profile: IProfile): Promise<IShift[]> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    // Получаем сущности
    const workshop = await this.workshopService.getWorkshop(workshopCode);
    const team = await this.teamService.getTeam(teamNumber);
    const schedule = await this.scheduleService.getScheduleByCode(scheduleCode);

    // Даты в UTC
    const today = getUTCToday();
    const tomorrow = getUTCTomorrow();
    const yesterday = getUTCYesterday();

    const allShifts: Shift[] = [];

    // График: 2-A, все цехи
    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      const currentShift = getShiftFor2A(teamNumber);

      // Если смена 1 завтра
      if (
        currentShift.shiftCode === 1 &&
        getUTCDateString(currentShift.date) === getUTCDateString(tomorrow)
      ) {
        const [workShft, holidayShft] = await Promise.all([
          this.shiftService.getShiftByDate(
            tomorrow,
            workshop.id,
            team.id,
            schedule.id,
          ),
          this.shiftService.getShiftByDate(
            today,
            workshop.id,
            team.id,
            schedule.id,
          ),
        ]);

        allShifts.push(workShft, holidayShft);
      }

      // Если смена 1 сегодня
      if (
        currentShift.shiftCode === 1 &&
        getUTCDateString(currentShift.date) === getUTCDateString(today)
      ) {
        const [workShft, holidayShft] = await Promise.all([
          this.shiftService.getShiftByDate(
            today,
            workshop.id,
            team.id,
            schedule.id,
          ),
          this.shiftService.getShiftByDate(
            yesterday,
            workshop.id,
            team.id,
            schedule.id,
          ),
        ]);

        allShifts.push(workShft, holidayShft);
      }

      // Если смена 2 сегодня
      if (currentShift.shiftCode === 2) {
        const [workShft, holidayShft] = await Promise.all([
          this.shiftService.getShiftByDate(
            today,
            workshop.id,
            team.id,
            schedule.id,
          ),
          this.shiftService.getShiftByDate(
            yesterday,
            workshop.id,
            team.id,
            schedule.id,
          ),
        ]);

        allShifts.push(workShft, holidayShft);
      }
    }

    // График: 5-Б-1, все цехи
    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      const shift = await this.shiftService.getShiftByDate(
        today,
        workshop.id,
        team.id,
        schedule.id,
      );

      allShifts.push(shift);
    }

    // График 9 отображаем в графике 5-Б-1
    if (this.isCondition_5B1_9(workshopCode, scheduleCode)) {
      const schedule9 = await this.scheduleService.getScheduleByCode(
        ESchedule.S_9,
      );

      const [team91, team92] = await Promise.all([
        this.teamService.getTeam(1),
        this.teamService.getTeam(2),
      ]);

      const [shift91, shift92] = await Promise.all([
        this.shiftService.getShiftByDate(
          today,
          workshop.id,
          team91.id,
          schedule9.id,
        ),
        this.shiftService.getShiftByDate(
          today,
          workshop.id,
          team92.id,
          schedule9.id,
        ),
      ]);

      allShifts.push(shift91, shift92);
    }

    // График 9 отображаем в графике 2-А
    if (this.isCondition_2A_9(workshopCode, scheduleCode)) {
      // Даты в UTC
      const today = getUTCToday();
      const tomorrow = getUTCTomorrow();

      // Получаем текущую смену
      const currentShift = getShiftFor2A(teamNumber);

      if (
        this.isRelevantShift(currentShift, today, tomorrow) &&
        currentShift.shiftCode === 2
      ) {
        const schedule9 = await this.scheduleService.getScheduleByCode(
          ESchedule.S_9,
        );

        const [team91, team92] = await Promise.all([
          this.teamService.getTeam(1),
          this.teamService.getTeam(2),
        ]);

        const [shift91, shift92] = await Promise.all([
          this.shiftService.getShiftByDate(
            today,
            workshop.id,
            team91.id,
            schedule9.id,
          ),
          this.shiftService.getShiftByDate(
            today,
            workshop.id,
            team92.id,
            schedule9.id,
          ),
        ]);

        allShifts.push(shift91, shift92);
      }
    }

    const validShifts = allShifts.filter(
      (shift): shift is Shift => shift !== null,
    );

    if (validShifts.length === 0) {
      return [];
    }

    return this.mapShiftsList(validShifts);
  }

  async getShiftsByDay(
    dto: ShiftDateDto,
    profile: IProfile,
  ): Promise<IShift[]> {
    const { workshopCode, teamNumber, scheduleCode } = profile;
    const targetDate = getUTC(dto.shiftDate);

    const [workshop, team, schedule] = await Promise.all([
      this.workshopService.getWorkshop(workshopCode),
      this.teamService.getTeam(teamNumber),
      this.scheduleService.getScheduleByCode(scheduleCode),
    ]);

    const allShifts: Shift[] = [];

    // 2-A
    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      const shifts = await this.shiftService.getAllShiftByDate(
        targetDate,
        workshop.id,
        team.id,
        schedule.id,
      );

      allShifts.push(...shifts);
    }

    // 5-Б-1
    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      const shifts = await this.shiftService.getAllShiftByDate(
        targetDate,
        workshop.id,
        team.id,
        schedule.id,
      );

      allShifts.push(...shifts);
    }

    // 9 в 5-Б-1
    if (this.isCondition_5B1_9(workshopCode, scheduleCode)) {
      const schedule9 = await this.scheduleService.getScheduleByCode(
        ESchedule.S_9,
      );

      const [team91, team92] = await Promise.all([
        this.teamService.getTeam(1),
        this.teamService.getTeam(2),
      ]);

      const [shifts91, shifts92] = await Promise.all([
        this.shiftService.getAllShiftByDate(
          targetDate,
          workshop.id,
          team91.id,
          schedule9.id,
        ),
        this.shiftService.getAllShiftByDate(
          targetDate,
          workshop.id,
          team92.id,
          schedule9.id,
        ),
      ]);

      allShifts.push(...shifts91, ...shifts92);
    }

    // 9 в 2-А
    if (this.isCondition_2A_9(workshopCode, scheduleCode)) {
      const schedule9 = await this.scheduleService.getScheduleByCode(
        ESchedule.S_9,
      );

      const [team91, team92] = await Promise.all([
        this.teamService.getTeam(1),
        this.teamService.getTeam(2),
      ]);

      const [shifts91, shifts92] = await Promise.all([
        this.shiftService.getAllShiftByDate(
          targetDate,
          workshop.id,
          team91.id,
          schedule9.id,
        ),
        this.shiftService.getAllShiftByDate(
          targetDate,
          workshop.id,
          team92.id,
          schedule9.id,
        ),
      ]);

      allShifts.push(...shifts91, ...shifts92);
    }

    if (allShifts.length === 0) {
      throw new NotFoundException('Смены не найдены');
    }

    return this.mapShiftsList(allShifts);
  }

  async getShiftById(dto: ShiftIdDto): Promise<IShift> {
    const shift = await this.shiftService.getShiftById(dto);
    const mapped = this.mapShiftsList([shift]);

    return mapped[0];
  }

  /*
  // --- МЕТОД АДАПТИРОВАТЬ ПОД СОЗДАНИЕ СМЕНЫ С ПАРАМЕТРОМ НА ВХОДЕ (date: Date()) ---
  async createMissingShifts(profile: IProfile): Promise<ISuccess> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    const workshop = await this.workshopService.getWorkshop(workshopCode);
    const workType = await this.attendanceTypeService.getAttendanceType(
      EAttendanceCode.Y,
    );

    const holidayType = await this.attendanceTypeService.getAttendanceType(
      EAttendanceCode.V,
    );

    const currentShifts = await this.getShifts(profile);
    let monthDates: Date[] = [];

    // Получаем все дни с начала месяца
    if (currentShifts.length > 0) {
      monthDates = this.getDatesUntilYesterday();
    } else {
      monthDates = this.getDatesUntilDayBeforeYesterday();
    }

    // 1. Определяем какие графики принадлежат профилю
    const configs: { scheduleCode: string; teamNumber: number }[] = [];

    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_2A, teamNumber });
    }

    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_5B1, teamNumber });
    }

    if (
      this.isCondition_5B1_9(workshopCode, scheduleCode) ||
      this.isCondition_2A_9(workshopCode, scheduleCode)
    ) {
      configs.push(
        { scheduleCode: ESchedule.S_9, teamNumber: 1 },
        { scheduleCode: ESchedule.S_9, teamNumber: 2 },
      );
    }

    // 2. Собираем пропущенные даты по всем графикам
    const missingByConfig: {
      team: Team;
      schedule: Schedule;
      config: { scheduleCode: string; teamNumber: number };
      dates: Date[];
    }[] = [];

    for (const config of configs) {
      const team = await this.teamService.getTeam(config.teamNumber);
      const schedule = await this.scheduleService.getScheduleByCode(
        config.scheduleCode,
      );

      let existingShifts: Shift[] = [];

      existingShifts =
        await this.shiftService.getAllShiftsInCurrentMonthUntilToday(
          workshop.id,
          team.id,
          schedule.id,
        );

      const missingDates = this.getMissingDays(monthDates, existingShifts);

      if (missingDates.length > 0) {
        missingByConfig.push({ team, schedule, config, dates: missingDates });
      }
    }

    // Если пропущенных дат нет — смены создавать не нужно
    if (missingByConfig.length === 0) {
      return { message: 'Смены создавать не нужно' };
    }

    // 3. Создаём смены для каждой пропущенной даты
    for (const { team, schedule, config, dates } of missingByConfig) {
      const employees = await this.getEmployeesForSchedule(
        workshopCode,
        config.teamNumber,
        config.scheduleCode,
      );

      for (const date of dates) {
        const shiftInfo = this.getShiftInfo(
          config.scheduleCode,
          config.teamNumber,
          date,
        );

        try {
          if (this.isWorkDay(config.scheduleCode, shiftInfo, date)) {
            await this.createShiftForWork(
              shiftInfo.dayOfWeek,
              workshopCode,
              config.scheduleCode,
              shiftInfo.shiftCode!,
              date,
              team,
              workshop,
              schedule,
              employees,
              workType,
            );
          } else {
            await this.createShiftForHoliday(
              date,
              team,
              workshop,
              schedule,
              employees,
              holidayType,
            );
          }
        } catch (error) {
          if (
            error instanceof QueryFailedError &&
            error.driverError?.code === '23505'
          ) {
            // Дубликат — нормально, пропускаем
            continue;
          }
          throw error;
        }
      }
    }

    return { message: 'Смены созданы успешно' };
  }
    */

  async checkMissingShifts(profile: IProfile): Promise<ISuccess> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    const workshop = await this.workshopService.getWorkshop(workshopCode);

    // 1. Определяем графики профиля
    const configs: { scheduleCode: string; teamNumber: number }[] = [];

    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_2A, teamNumber });
    }

    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_5B1, teamNumber });
    }

    if (
      this.isCondition_5B1_9(workshopCode, scheduleCode) ||
      this.isCondition_2A_9(workshopCode, scheduleCode)
    ) {
      configs.push(
        { scheduleCode: ESchedule.S_9, teamNumber: 1 },
        { scheduleCode: ESchedule.S_9, teamNumber: 2 },
      );
    }

    // 2. Определяем период проверки
    const currentShifts = await this.getShifts(profile);
    const monthDates =
      currentShifts.length > 0
        ? this.getDatesUntilYesterday()
        : this.getDatesUntilDayBeforeYesterday();

    // 3. Проверяем каждый график на пропущенные даты
    let hasMissing = false;

    for (const config of configs) {
      const team = await this.teamService.getTeam(config.teamNumber);
      const schedule = await this.scheduleService.getScheduleByCode(
        config.scheduleCode,
      );

      // const existingShifts =
      //   await this.shiftService.getAllShiftsInCurrentMonthUntilToday(
      //     workshop.id,
      //     team.id,
      //     schedule.id,
      //   );

      // const missingDates = this.getMissingDays(monthDates, existingShifts);

      // if (missingDates.length > 0) {
      //   hasMissing = true;
      //   break;
      // }
    }

    // 4. Пропущенных смен нет — уведомление не нужно
    if (!hasMissing) {
      return { message: 'Пропущенных смен нет' };
    }

    // 5. Создаём уведомление
    // await this.noticeService.createMissingShiftNotice(profile);

    return { message: 'Уведомление о пропущенных сменах создано' };
  }

  async getUncheckedShifts(profile: IProfile): Promise<IShift[]> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    const workshop = await this.workshopService.getWorkshop(workshopCode);

    // 1. Определяем какие графики принадлежат профилю
    const configs: { scheduleCode: string; teamNumber: number }[] = [];

    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_2A, teamNumber });
    }

    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      configs.push({ scheduleCode: ESchedule.S_5B1, teamNumber });
    }

    if (
      this.isCondition_5B1_9(workshopCode, scheduleCode) ||
      this.isCondition_2A_9(workshopCode, scheduleCode)
    ) {
      configs.push(
        { scheduleCode: ESchedule.S_9, teamNumber: 1 },
        { scheduleCode: ESchedule.S_9, teamNumber: 2 },
      );
    }

    // 2. Для каждого графика получаем непроверенные смены
    const allUncheckedShifts: Shift[] = [];

    for (const config of configs) {
      const team = await this.teamService.getTeam(config.teamNumber);
      const schedule = await this.scheduleService.getScheduleByCode(
        config.scheduleCode,
      );

      const result = await this.shiftService.getAllInCurrentAndPreviousMonth(
        workshop.id,
        team.id,
        schedule.id,
      );

      allUncheckedShifts.push(...result);
    }

    const mapped = this.mapShiftsList(allUncheckedShifts);

    // Оставляем только те, где хотя бы одно из условий false
    return mapped.filter(
      (shift) => !shift.isChecked || !shift.isAssignmentComplete,
    );
  }

  private getShiftStrategies(
    profile: IProfile,
    baseDate: Date | null = null,
  ): ((p: IProfile) => Promise<void>)[] {
    const { workshopCode, teamNumber, scheduleCode } = profile;
    const strategies: ((p: IProfile) => Promise<void>)[] = [];

    // Даты в UTC
    const today = getUTCToday(baseDate);
    const tomorrow = getUTCTomorrow(baseDate);

    // График 2-A, все цехи
    if (this.isCondition_2A(workshopCode, scheduleCode)) {
      // Получаем текущую смену по графику 2-А
      const currentShift = getShiftFor2A(teamNumber, baseDate);

      // Добавляем стратегию только, если смена релевантна
      if (this.isRelevantShift(currentShift, today, tomorrow)) {
        strategies.push((p) => this.createShift_2A(p, baseDate));
      }
    }

    // График 5-Б-1, все цехи
    if (this.isCondition_5B1(workshopCode, scheduleCode)) {
      strategies.push((p) => this.createShift_5B1(p, baseDate));
    }

    // График 91 создается графиком 5-Б-1
    if (this.isCondition_5B1_9(workshopCode, scheduleCode)) {
      strategies.push((p) => this.createShift_91(p, baseDate));
    }

    // График 92 создается графиком 5-Б-1
    if (this.isCondition_5B1_9(workshopCode, scheduleCode)) {
      strategies.push((p) => this.createShift_92(p, baseDate));
    }

    // График 91 создается графиком 2‑A
    if (this.isCondition_2A_9(workshopCode, scheduleCode)) {
      // Получаем текущую смену по графику 2-А
      const currentShift = getShiftFor2A(teamNumber, baseDate);

      // Добавляем стратегию только, если смена 2 и релевантна
      if (
        this.isRelevantShift(currentShift, today, tomorrow) &&
        currentShift.shiftCode === 2
      ) {
        strategies.push((p) => this.createShift_91(p, baseDate));
      }
    }

    // График 92 создается графиком 2‑A
    if (this.isCondition_2A_9(workshopCode, scheduleCode)) {
      // Получаем текущую смену по графику 2-А
      const currentShift = getShiftFor2A(teamNumber, baseDate);

      // Добавляем стратегию только, если смена 2 и релевантна
      if (
        this.isRelevantShift(currentShift, today, tomorrow) &&
        currentShift.shiftCode === 2
      ) {
        strategies.push((p) => this.createShift_92(p, baseDate));
      }
    }

    return strategies;
  }

  private mapShiftsList(shifts: Shift[]): IShift[] {
    return shifts.map((shift) => {
      const isAssignmentComplete = shift.employeeShifts.every(
        (employeeShift) => {
          if (employeeShift.workPlace !== null) {
            return true;
          }

          if (!employeeShift.attendanceType) {
            return false;
          }

          return (
            employeeShift.attendanceType.attendanceCode === EAttendanceCode.V
          );
        },
      );

      return {
        id: shift.id,
        date: shift.date,
        schedule: shift.schedule,
        shiftSchedule: shift.shiftSchedule,
        team: shift.team,
        workshop: shift.workshop,
        isChecked: shift.isChecked,
        isAssignmentComplete,
      };
    });
  }

  private async createShift_2A(
    profile: IProfile,
    baseDate: Date | null = null,
  ): Promise<void> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor2A(teamNumber, baseDate),
      baseDate,
    );
  }

  private createShift_5B1(
    profile: IProfile,
    baseDate: Date | null = null,
  ): Promise<void> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor5B1(teamNumber, baseDate),
      baseDate,
    );
  }

  private createShift_91(
    profile: IProfile,
    baseDate: Date | null = null,
  ): Promise<void> {
    const { workshopCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      1,
      ESchedule.S_9,
      () => getShiftFor9(1, baseDate),
      baseDate,
    );
  }

  private createShift_92(
    profile: IProfile,
    baseDate: Date | null = null,
  ): Promise<void> {
    const { workshopCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      2,
      ESchedule.S_9,
      () => getShiftFor9(2, baseDate),
      baseDate,
    );
  }

  private async createShiftForSchedule(
    workshopCode: string,
    teamNumber: number,
    scheduleCode: string,
    shiftGetter: (teamNumber: number) => IShiftInfo,
    baseDate: Date | null = null,
  ): Promise<void> {
    // Получаем сущности
    const workshop = await this.workshopService.getWorkshop(workshopCode);
    const team = await this.teamService.getTeam(teamNumber);
    const schedule = await this.scheduleService.getScheduleByCode(scheduleCode);
    const workType = await this.attendanceTypeService.getAttendanceType(
      EAttendanceCode.Y,
    );
    const holidayType = await this.attendanceTypeService.getAttendanceType(
      EAttendanceCode.V,
    );

    // Формируем список сотрудников
    const employees = await this.getEmployeesForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
    );

    // Получаем текущую смену
    const currentShift = shiftGetter(teamNumber);

    try {
      // График 2-A
      if (scheduleCode === ESchedule.S_2A) {
        // Получаем даты в UTC
        const today = getUTCToday(baseDate);
        const tomorrow = getUTCTomorrow(baseDate);
        const yesterday = getUTCYesterday(baseDate);

        // Проверяем релевантность смены
        if (!this.isRelevantShift(currentShift, today, tomorrow)) {
          return;
        }

        // Если смена 1 завтра
        if (
          currentShift.shiftCode === 1 &&
          getUTCDateString(currentShift.date) === getUTCDateString(tomorrow)
        ) {
          // Создаем рабочую смену
          await this.createShiftForWork(
            currentShift.dayOfWeek,
            workshopCode,
            scheduleCode,
            currentShift.shiftCode,
            tomorrow,
            team,
            workshop,
            schedule,
            employees,
            workType,
          );

          // Создаем смену выходного дня
          await this.createShiftForHoliday(
            today,
            team,
            workshop,
            schedule,
            employees,
            holidayType,
          );
        }

        // Если смена 1 сегодня
        if (
          currentShift.shiftCode === 1 &&
          getUTCDateString(currentShift.date) === getUTCDateString(today)
        ) {
          // Создаем рабочую смену
          await this.createShiftForWork(
            currentShift.dayOfWeek,
            workshopCode,
            scheduleCode,
            currentShift.shiftCode,
            today,
            team,
            workshop,
            schedule,
            employees,
            workType,
          );

          // Создаем смену выходного дня
          await this.createShiftForHoliday(
            yesterday,
            team,
            workshop,
            schedule,
            employees,
            holidayType,
          );
        }

        // Если смена 2
        if (currentShift.shiftCode === 2) {
          // Создаем рабочую смену
          await this.createShiftForWork(
            currentShift.dayOfWeek,
            workshopCode,
            scheduleCode,
            currentShift.shiftCode,
            today,
            team,
            workshop,
            schedule,
            employees,
            workType,
          );

          // Создаем смену выходного дня
          await this.createShiftForHoliday(
            yesterday,
            team,
            workshop,
            schedule,
            employees,
            holidayType,
          );
        }
      }

      if (currentShift.shiftCode !== null) {
        // Создаем рабочую смену
        await this.createShiftForWork(
          currentShift.dayOfWeek, // график 9 (универсальный, день - 0)
          workshopCode,
          scheduleCode,
          currentShift.shiftCode,
          currentShift.date,
          team,
          workshop,
          schedule,
          employees,
          workType, // тип посещаемости 'Я'
        );
      } else {
        // Создаем смену выходного дня
        await this.createShiftForHoliday(
          currentShift.date,
          team,
          workshop,
          schedule,
          employees,
          holidayType, // тип посещаемости 'В'
        );
      }
    } catch (error) {
      this.handleShiftCreationError(error);
    }
  }

  private async createShiftForWork(
    dayOfWeek: number,
    workshopCode: string,
    scheduleCode: string,
    shiftCode: number,
    date: Date,
    team: Team,
    workshop: Workshop,
    schedule: Schedule,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    // Находим расписание для рабочей смены
    const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
      dayOfWeek,
      workshopCode,
      scheduleCode,
      shiftCode,
    );

    // Ищем смену
    const count = await this.shiftRepository.countShifts(
      date,
      workshop.id,
      team.id,
      schedule.id,
    );

    if (count === 0) {
      // Создаем рабочую смену
      const shift = await this.shiftRepository.create({
        date,
        team,
        workshop,
        schedule,
        shiftSchedule,
      });

      // Создаем рабочие смены сотрудников с типом посещаемости 'Я'
      await this.createEmployeeShiftsForWork(
        dayOfWeek,
        shiftCode,
        shift,
        employees,
        attendanceType,
      );
    }
  }

  private async createShiftForHoliday(
    date: Date,
    team: Team,
    workshop: Workshop,
    schedule: Schedule,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    // Ищем смену
    const count = await this.shiftRepository.countShifts(
      date,
      workshop.id,
      team.id,
      schedule.id,
    );

    if (count === 0) {
      // Если нет — cоздаем смену выходного дня
      const shift = await this.shiftRepository.create({
        date,
        team,
        workshop,
        schedule,
        shiftSchedule: null, // расписания нет, потому что выходной день
      });

      // Создаем смены выходного дня сотрудников с типом посещаемости 'В'
      await this.createEmployeeShiftsForHoliday(
        shift,
        employees,
        attendanceType,
      );
    }
  }

  private async createEmployeeShiftsForWork(
    dayOfWeek: number,
    shiftCode: number,
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    for (const employee of employees) {
      const workshopCode = employee.position?.workshop?.workshopCode;
      const scheduleCode = employee.position?.schedule?.scheduleCode;

      // ВАЖНО!!! Логику дописать в будущем
      // Позиция должна вычисляться
      // Либо распоряжение, либо штатная позиция
      const currentPosition = employee.position;

      const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
        dayOfWeek,
        workshopCode,
        scheduleCode,
        shiftCode,
      );

      const minutes = calcShiftDuration(shiftSchedule);

      await this.employeeShiftRepository.create({
        minutes,
        employee,
        shift,
        attendanceType,
        currentPosition,
        workPlace: null,
      });
    }
  }

  private async createEmployeeShiftsForHoliday(
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    for (const employee of employees) {
      // ВАЖНО!!! Логику дописать в будущем
      // Позиция должна вычисляться
      // Либо распоряжение, либо штатная позиция
      const currentPosition = employee.position;

      await this.employeeShiftRepository.create({
        minutes: 0,
        isPresent: null,
        employee,
        shift,
        attendanceType,
        currentPosition,
        workPlace: null,
      });
    }
  }

  private async getEmployeesForSchedule(
    workshopCode: string,
    teamNumber: number,
    scheduleCode: string,
  ): Promise<Employee[]> {
    if (scheduleCode === ESchedule.S_2A && workshopCode === EWorkshop.W_LPC11) {
      const [employees2A, employees2] = await Promise.all([
        this.employeeService.getTeamEmployees(
          teamNumber,
          workshopCode,
          scheduleCode,
        ),
        this.employeeService.getTeamEmployees(
          teamNumber,
          workshopCode,
          ESchedule.S_2,
        ),
      ]);

      return [...employees2A, ...employees2];
    }

    return this.employeeService.getTeamEmployees(
      teamNumber,
      workshopCode,
      scheduleCode,
    );
  }

  private handleShiftCreationError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      // Проверяем, похоже ли на нарушение уникального ограничения (частая причина «Смена уже создана»)
      const isUniqueViolation =
        error.message.includes('duplicate key') ||
        error.message.includes('unique constraint') ||
        error.message.includes('already exists');

      if (isUniqueViolation) {
        // return { message: 'Смена уже создана' };
        throw new ConflictException('Смена уже создана');
      }

      // Если это QueryFailedError, но не про уникальность — лучше пробросить как конфликт или серверную ошибку
      throw new ConflictException('Не удалось создать смену: конфликт данных');
    }

    // Для всех остальных ошибок — стандартная серверная ошибка
    throw new InternalServerErrorException(
      `Не удалось создать смену: ${error}`,
    );
  }

  private isCondition_2A(workshopCode: string, scheduleCode: string): boolean {
    return (
      scheduleCode === ESchedule.S_2A &&
      [
        EWorkshop.W_LPC4,
        EWorkshop.W_LPC5,
        EWorkshop.W_LPC8_UGP,
        EWorkshop.W_LPC8_UL,
        EWorkshop.W_LPC10,
        EWorkshop.W_LPC11,
        EWorkshop.W_PMP_North,
        EWorkshop.W_PMP_South,
      ].includes(workshopCode as EWorkshop)
    );
  }

  private isCondition_5B1(workshopCode: string, scheduleCode: string): boolean {
    return (
      scheduleCode === ESchedule.S_5B1 &&
      [
        EWorkshop.W_LPC4,
        EWorkshop.W_LPC5,
        EWorkshop.W_LPC8_UGP,
        EWorkshop.W_LPC8_UL,
        EWorkshop.W_LPC10,
        EWorkshop.W_LPC11,
        EWorkshop.W_PMP_North,
        EWorkshop.W_PMP_South,
      ].includes(workshopCode as EWorkshop)
    );
  }

  private isCondition_5B1_9(
    workshopCode: string,
    scheduleCode: string,
  ): boolean {
    return (
      scheduleCode === ESchedule.S_5B1 &&
      [
        // EWorkshop.W_LPC5,
        // EWorkshop.W_LPC8_UGP,
        EWorkshop.W_LPC8_UL,
        EWorkshop.W_LPC10,
        EWorkshop.W_PMP_North,
      ].includes(workshopCode as EWorkshop)
    );
  }

  private isCondition_2A_9(
    workshopCode: string,
    scheduleCode: string,
  ): boolean {
    return (
      scheduleCode === ESchedule.S_2A &&
      [EWorkshop.W_LPC8_UGP].includes(workshopCode as EWorkshop)
    );
  }

  private isRelevantShift(
    currentShift: {
      date: Date;
      shiftCode: number;
    },
    today: Date,
    tomorrow: Date,
  ): boolean {
    const isFirstShiftTomorrow =
      currentShift.shiftCode === 1 &&
      currentShift.date.getTime() === tomorrow.getTime();

    const isFirstShiftToday =
      currentShift.shiftCode === 1 &&
      currentShift.date.getTime() === today.getTime();

    const isSecondShiftToday =
      currentShift.shiftCode === 2 &&
      currentShift.date.getTime() === today.getTime();

    return isFirstShiftTomorrow || isFirstShiftToday || isSecondShiftToday;
  }

  private getShiftInfo(
    scheduleCode: string,
    teamNumber: number,
    date: Date,
  ): IShiftInfo {
    if (scheduleCode === ESchedule.S_2A) {
      return getShiftFor2A(teamNumber, date);
    }

    if (scheduleCode === ESchedule.S_5B1) {
      return getShiftFor5B1(teamNumber, date);
    }

    return getShiftFor9(teamNumber, date);
  }

  private isWorkDay(
    scheduleCode: string,
    shiftInfo: IShiftInfo,
    date: Date,
  ): boolean {
    if (scheduleCode === ESchedule.S_2A) {
      // Для 2-A: если дата начала смены совпадает с целевой датой — рабочий день.
      // Если не совпадает — значит целевая дата это выходной внутри цикла.
      return getUTCDateString(shiftInfo.date) === getUTCDateString(date);
    }

    // Для 5-Б-1 и 9: shiftCode !== null — рабочий день
    return shiftInfo.shiftCode !== null;
  }

  // До вчерашнего дня включительно
  private getDatesUntilYesterday(): Date[] {
    return this.getDatesUntil(1);
  }

  // До позавчера включительно
  private getDatesUntilDayBeforeYesterday(): Date[] {
    return this.getDatesUntil(2);
  }

  private getDatesUntil(offset: number): Date[] {
    const now = new Date();
    const limitDay = now.getUTCDate() - offset;
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    const dates: Date[] = [];

    for (let day = 1; day <= limitDay; day++) {
      dates.push(new Date(Date.UTC(year, month, day)));
    }

    return dates;
  }

  private getMissingDays = (monthDates: Date[], shifts: Shift[]): Date[] => {
    // 1. Создаём Set из дат смен (нормализованных на 00:00)
    const shiftDateKeys = new Set<number>(
      shifts.map((shift) => {
        const d = new Date(shift.date);
        d.setUTCHours(0, 0, 0, 0);
        return d.getTime();
      }),
    );

    // 2. Фильтруем полный список месяца: оставляем только те даты, которых нет в сменах
    return monthDates.filter((date) => {
      const d = new Date(date);
      d.setUTCHours(0, 0, 0, 0);
      return !shiftDateKeys.has(d.getTime());
    });
  };

  // 'НУЖНА ЛОГИКА!!!'
  private mapToIMessage(notice: Notice): IMessage {
    let itemId = '';
    let title = '';

    // 'НУЖНА ЛОГИКА!!!'
    // if (notice.categoryCode === 'shift' && notice.shift) {
    //   itemId = notice.shift.id;
    //   title = `${ENoticeTitle.TIMESHEET} от ${new Date(notice.shift.date).toLocaleDateString('ru-RU')}`;
    // }
    // else if (notice.category.code === 'document' && notice.documentId) {
    //   itemId = notice.documentId;
    //   title = 'Документ';
    // }

    return {
      id: notice.id,
      category: notice.category.categoryCode,
      title: notice.category.titleText,
      statusText: this.getNoticeStatus(
        notice.category.categoryCode,
        notice.category.actionCode,
      ),
      itemId,
      actionLabel: this.getNoticeActionLabel(
        notice.category.categoryCode,
        notice.category.actionCode,
      ),
      isUnread: notice.isUnread,
      isResolved: notice.isResolved,
      createdAt: notice.createdAt.toISOString(), // гарантирует ISO 8601
    };
  }

  // Helper для получения статуса
  private getNoticeStatus(categoryCode: string, actionCode: string): string {
    const NOTICE_STATUS_MAP: Record<string, string> = {
      'shift:create': ENoticeStatus.SHIFT_NOT_CREATED,
      'shift:fill': ENoticeStatus.SHIFT_NOT_FILLED,
      'document:sign': ENoticeStatus.DOCUMENT_NOT_SIGNED,
    };

    const key = `${categoryCode}:${actionCode}`;
    const status = NOTICE_STATUS_MAP[key];

    if (!status) {
      throw new Error(`Неизвестный статус для комбинации: ${key}`);
    }
    return status;
  }

  private getNoticeActionLabel(
    categoryCode: string,
    actionCode: string,
  ): string {
    const NOTICE_ACTION_LABEL_MAP: Record<string, string> = {
      'shift:create': ENoticeActionLabel.CREATE_SHIFT,
      'shift:fill': ENoticeActionLabel.FILL_SHIFT,
      'document:sign': ENoticeActionLabel.SIGN_DOCUMENT,
    };

    const key = `${categoryCode}:${actionCode}`;
    const label = NOTICE_ACTION_LABEL_MAP[key];

    if (!label) {
      throw new Error(`Неизвестный actionLabel для комбинации: ${key}`);
    }
    return label;
  }
}

// console.log(shift);
// console.log(
//   'Смены работников:',
//   employeeShifts.map((es) => ({
//     id: es.id,
//     employeeId: es.employee.id,
//     employeeName: `${es.employee.lastName} ${es.employee.firstName}`,
//     hours: es.minutes,
//     attendanceCode: es.attendanceType.attendanceCode,
//     profession: es.currentProfession?.name,
//   })),
// );
