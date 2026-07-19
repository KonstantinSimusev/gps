import { QueryFailedError } from 'typeorm';

import {
  BadRequestException,
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
  getUTCToday,
  getUTCTomorrow,
  getUTCYesterday,
} from '../../shared/utils/utils';

import {
  EAttendanceCode,
  ESchedule,
  EWorkshop,
} from '../../shared/enums/enums';

import {
  IProfile,
  IShift,
  ISuccess,
  ShiftInfo,
} from '../../shared/interfaces/api.interface';

import { AttendanceType } from '../attendance-type/entities/attendance-type.entity';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeShift } from '../employee-shift/entities/employee-shift.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Team } from '../team/entities/team.entity';
import { Workshop } from '../workshop/entities/workshop.entity';

import { EmployeeShiftRepository } from '../employee-shift/employee-shift.repository';
import { ShiftRepository } from '../shift/shift.repository';

import { AttendanceTypeService } from '../attendance-type/attendance-type.service';
import { EmployeeService } from '../employee/employee.service';
import { ShiftScheduleService } from '../shift-schedule/shift-schedule.service';
import { ShiftService } from '../shift/shift.service';
import { TeamService } from '../team/team.service';
import { WorkshopService } from '../workshop/workshop.service';

@Injectable()
export class ShiftManagementService {
  constructor(
    private readonly employeeShiftRepository: EmployeeShiftRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly attendanceTypeService: AttendanceTypeService,
    private readonly employeeService: EmployeeService,
    private readonly shiftScheduleService: ShiftScheduleService,
    private readonly shiftService: ShiftService,
    private readonly teamService: TeamService,
    private readonly workshopService: WorkshopService,
  ) {}

  async createShift(profile: IProfile): Promise<ISuccess> {
    const strategies = this.getShiftCreationStrategies(profile);

    // Запускаем все стратегии параллельно
    await Promise.all(strategies.map((strategy) => strategy(profile)));

    return { message: 'Смены созданы успешно' };
  }

  async getCurrentShifts(profile: IProfile): Promise<IShift[]> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    const [workshop, team] = await Promise.all([
      await this.workshopService.getWorkshop(workshopCode),
      await this.teamService.getTeam(teamNumber),
    ]);

    // Получаем даты в UTC
    const today = getUTCToday();
    const tomorrow = getUTCTomorrow();
    const yesterday = getUTCYesterday();

    // График: 5-Б-1
    // Цех: ЛПЦ-11
    if (
      scheduleCode === ESchedule.S_5B1 &&
      [EWorkshop.W_LPC11].includes(workshopCode as EWorkshop)
    ) {
      const [shift] = await Promise.all([
        this.shiftService.getCurrentShifts(today, workshop.id, team.id),
      ]);

      return [...shift];
    }

    // График: 5-Б-1, 9-1, 9-2
    // Цех: ЛПЦ-5, ЛПЦ-10, ПМП(СБ)
    if (
      scheduleCode === ESchedule.S_5B1 &&
      [EWorkshop.W_LPC5, EWorkshop.W_LPC10, EWorkshop.W_PMP_North].includes(
        workshopCode as EWorkshop,
      )
    ) {
      const [team91, team92] = await Promise.all([
        await this.teamService.getTeam(1),
        await this.teamService.getTeam(2),
      ]);

      const [shift5, shift91, shift92] = await Promise.all([
        await this.shiftService.getCurrentShifts(today, workshop.id, team.id),
        await this.shiftService.getCurrentShifts(today, workshop.id, team91.id),
        await this.shiftService.getCurrentShifts(today, workshop.id, team92.id),
      ]);

      return [...shift5, ...shift91, ...shift92];
    }

    // График: 2-A
    // Цех: ЛПЦ-4, ЛПЦ-5, ЛПЦ-10, ЛПЦ-11, ПМП(ЮБ)
    if (
      scheduleCode === ESchedule.S_2A &&
      [
        EWorkshop.W_LPC4,
        EWorkshop.W_LPC5,
        EWorkshop.W_LPC10,
        EWorkshop.W_LPC11,
        EWorkshop.W_PMP_North,
      ].includes(workshopCode as EWorkshop)
    ) {
      const currentShift2A = getShiftFor2A(teamNumber);

      if (currentShift2A.shiftCode === 1) {
        const [workShft, holdayShft] = await Promise.all([
          this.shiftService.getCurrentShifts(tomorrow, workshop.id, team.id),
          this.shiftService.getCurrentShifts(today, workshop.id, team.id),
        ]);

        return [...workShft, ...holdayShft];
      }

      if (currentShift2A.shiftCode === 2) {
        const [workShft, holdayShft] = await Promise.all([
          this.shiftService.getCurrentShifts(today, workshop.id, team.id),
          this.shiftService.getCurrentShifts(yesterday, workshop.id, team.id),
        ]);

        return [...workShft, ...holdayShft];
      }
    }
  }

  private getShiftCreationStrategies(
    profile: IProfile,
  ): ((p: IProfile) => Promise<ISuccess>)[] {
    const { workshopCode, scheduleCode } = profile;
    const strategies: ((p: IProfile) => Promise<ISuccess>)[] = [];

    // Все цехи для графиков 2-А и 5-б-1
    const ALL_WORKSHOPS = [
      EWorkshop.W_LPC4,
      EWorkshop.W_LPC5,
      EWorkshop.W_LPC7,
      EWorkshop.W_LPC8,
      EWorkshop.W_LPC10,
      EWorkshop.W_LPC11,
      EWorkshop.W_PMP_North,
      EWorkshop.W_PMP_South,
    ];

    // Цехи, где график 9 создаётся графиком 5‑Б‑1
    const WORKSHOPS_FOR_9_FROM_5B1 = [
      EWorkshop.W_LPC5,
      EWorkshop.W_LPC10,
      EWorkshop.W_PMP_North,
    ];

    // Цехи, где график 9 создаётся графиком 2-А
    const WORKSHOPS_FOR_9_FROM_2A = [EWorkshop.W_PMP_South];

    // График 2-A, все цехи
    if (
      scheduleCode === ESchedule.S_2A &&
      ALL_WORKSHOPS.includes(workshopCode as EWorkshop)
    ) {
      strategies.push((p) => this.createShift_2A(p));
    }

    // График 5-Б-1, все цехи
    if (
      scheduleCode === ESchedule.S_5B1 &&
      ALL_WORKSHOPS.includes(workshopCode as EWorkshop)
    ) {
      strategies.push((p) => this.createShift_5B1(p));
    }

    // График 9 создается графиком 5-Б-1
    if (
      scheduleCode === ESchedule.S_5B1 &&
      WORKSHOPS_FOR_9_FROM_5B1.includes(workshopCode as EWorkshop)
    ) {
      strategies.push((p) => this.createShift_9(p));
    }

    // График 9 создается графиком 2‑A
    if (
      scheduleCode === ESchedule.S_2A &&
      WORKSHOPS_FOR_9_FROM_2A.includes(workshopCode as EWorkshop)
    ) {
      strategies.push((p) => this.createShift_9(p));
    }

    if (strategies.length === 0) {
      throw new BadRequestException(
        `Не поддерживается комбинация: цех ${workshopCode}, график ${scheduleCode}`,
      );
    }

    return strategies;
  }

  private async createShift_2A(profile: IProfile): Promise<ISuccess> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor2A(teamNumber),
    );
  }

  private createShift_5B1(profile: IProfile): Promise<ISuccess> {
    const { workshopCode, teamNumber, scheduleCode } = profile;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor5B1(teamNumber),
    );
  }

  private async createShift_9(profile: IProfile): Promise<ISuccess> {
    await Promise.all([
      this.createShift_91(profile),
      this.createShift_92(profile),
    ]);

    return { message: 'Все смены успешно созданы' };
  }

  private createShift_91(profile: IProfile): Promise<ISuccess> {
    const { workshopCode } = profile;
    const teamNumber = 1;
    const scheduleCode = ESchedule.S_9;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor9(teamNumber),
    );
  }

  private createShift_92(profile: IProfile): Promise<ISuccess> {
    const { workshopCode } = profile;
    const teamNumber = 2;
    const scheduleCode = ESchedule.S_9;

    return this.createShiftForSchedule(
      workshopCode,
      teamNumber,
      scheduleCode,
      () => getShiftFor9(teamNumber),
    );
  }

  private async createShiftForSchedule(
    workshopCode: string,
    teamNumber: number,
    scheduleCode: string,
    shiftGetter: (teamNumber: number) => ShiftInfo,
  ): Promise<ISuccess> {
    // Получаем сущности
    const [workshop, team, workType, holidayType] = await Promise.all([
      this.workshopService.getWorkshop(workshopCode),
      this.teamService.getTeam(teamNumber),
      this.attendanceTypeService.getAttendanceType(EAttendanceCode.Y),
      this.attendanceTypeService.getAttendanceType(EAttendanceCode.V),
    ]);

    // Формируем список сотрудников
    let employees: Employee[] = [];

    // Для графика 2-A ЛПЦ-11 добавляем сотрудников по графику 2
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

      employees = [...employees2A, ...employees2];
    } else {
      // в остальных случаях обычный поиск сотрудников по заданному графику
      employees = await this.employeeService.getTeamEmployees(
        teamNumber,
        workshopCode,
        scheduleCode,
      );
    }

    // Получаем текущую смену
    const currentShift = shiftGetter(teamNumber);

    try {
      // График 2-A
      if (scheduleCode === ESchedule.S_2A) {
        // Получаем даты в UTC
        const today = getUTCToday();
        const tomorrow = getUTCTomorrow();
        const yesterday = getUTCYesterday();

        // Проверяем релевантность смены
        if (!this.isRelevantShift(currentShift, today, tomorrow)) {
          return { message: 'Смен нет' };
        }

        // Рабочая смена
        await this.createShiftForWork(
          currentShift.dayOfWeek,
          workshopCode,
          scheduleCode,
          currentShift.shiftCode,
          currentShift.date,
          team,
          workshop,
          employees,
          workType,
        );

        // Выходной: дата зависит от номера смены
        const holidayDate = currentShift.shiftCode === 1 ? today : yesterday;

        await this.createShiftForHoliday(
          holidayDate,
          team,
          workshop,
          employees,
          holidayType,
        );

        return { message: 'Для 2-A созданы рабочая и выходная смены' };
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
          employees,
          workType, // тип посещаемости 'Я'
        );

        return { message: 'Создана рабочая смена' };
      } else {
        // Создаем смену выходного дня
        await this.createShiftForHoliday(
          currentShift.date,
          team,
          workshop,
          employees,
          holidayType, // тип посещаемости 'В'
        );

        return { message: 'Создана смена выходного дня' };
      }
    } catch (error) {
      return this.handleShiftCreationError(error);
    }
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

    const isSecondShiftToday =
      currentShift.shiftCode === 2 &&
      currentShift.date.getTime() === today.getTime();

    return isFirstShiftTomorrow || isSecondShiftToday;
  }

  private async createShiftForWork(
    dayOfWeek: number,
    workshopCode: string,
    scheduleCode: string,
    shiftCode: number,
    date: Date,
    team: Team,
    workshop: Workshop,
    employees: Employee[],
    attendanceType: AttendanceType,
  ) {
    // Находим расписание для рабочей смены
    const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
      dayOfWeek,
      workshopCode,
      scheduleCode,
      shiftCode,
    );

    // Создаем рабочую смену
    const shift = await this.shiftRepository.create({
      date,
      team,
      workshop,
      shiftSchedule,
    });

    // Создаем рабочие смены сотрудников
    await this.createEmployeeShiftsForWork(
      dayOfWeek,
      shiftCode,
      shift,
      employees,
      attendanceType,
    );
  }

  private async createShiftForHoliday(
    date: Date,
    team: Team,
    workshop: Workshop,
    employees: Employee[],
    attendanceType: AttendanceType,
  ) {
    // Создаем смену выходного дня
    const shift = await this.shiftRepository.create({
      date, // дата вчера
      team,
      workshop,
      shiftSchedule: null, // расписания нет, потому что выходной день
    });

    // Создаем смены выходного дня сотрудников с типом посещаемости 'В'
    await this.createEmployeeShiftsForHoliday(shift, employees, attendanceType);
  }

  private async createEmployeeShiftsForWork(
    dayOfWeek: number,
    shiftCode: number,
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    const employeeShifts: EmployeeShift[] = [];

    for (const employee of employees) {
      const workshopCode = employee.position?.workshop?.workshopCode;
      const scheduleCode = employee.position?.schedule?.scheduleCode;
      const currentProfession = employee.position?.profession;

      const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
        dayOfWeek,
        workshopCode,
        scheduleCode,
        shiftCode,
      );

      const hours = calcShiftDuration(shiftSchedule);

      employeeShifts.push(
        this.employeeShiftRepository.createObject({
          hours,
          employee,
          shift,
          attendanceType,
          currentProfession,
          workPlace: null,
        }),
      );
    }

    await this.employeeShiftRepository.saveAll(employeeShifts);
  }

  private async createEmployeeShiftsForHoliday(
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    const employeeShifts = employees.map((employee) => {
      const currentProfession = employee.position?.profession;

      return this.employeeShiftRepository.createObject({
        hours: 0,
        employee,
        shift,
        attendanceType,
        currentProfession,
        workPlace: null,
      });
    });

    await this.employeeShiftRepository.saveAll(employeeShifts);
  }

  private handleShiftCreationError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      // Проверяем, похоже ли на нарушение уникального ограничения (частая причина «Смена уже создана»)
      const isUniqueViolation =
        error.message.includes('duplicate key') ||
        error.message.includes('unique constraint') ||
        error.message.includes('already exists');

      if (isUniqueViolation) {
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
}

// console.log(shift);
// console.log(
//   'Смены работников:',
//   employeeShifts.map((es) => ({
//     employeeId: es.employee.id,
//     employeeName: `${es.employee.lastName} ${es.employee.firstName}`,
//     hours: es.hours,
//     attendanceCode: es.attendanceType.attendanceCode,
//     profession: es.currentProfession?.name,
//   })),
// );
