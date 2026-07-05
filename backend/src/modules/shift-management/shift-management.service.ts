import { QueryFailedError } from 'typeorm';

import {
  BadRequestException,
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
} from '../../shared/utils/utils';

import {
  EAttendanceCode,
  ESchedule,
  EWorkshop,
} from '../../shared/enums/enums';

import { AttendanceType } from '../attendance-type/entities/attendance-type.entity';
import { Employee } from '../employee/entities/employee.entity';
import { ShiftSchedule } from '../shift-schedule/entities/shift-schedule.entity';
import { Team } from '../team/entities/team.entity';
import { Workshop } from '../workshop/entities/workshop.entity';

import { IProfile, ISuccess } from '../../shared/interfaces/api.interface';

import { AttendanceTypeRepository } from '../attendance-type/attendance-type.repository';
import { EmployeeRepository } from '../employee/employee.repository';
import { EmployeeShiftRepository } from '../employee-shift/employee-shift.repository';
import { ShiftRepository } from '../shift/shift.repository';
import { TeamRepository } from '../team/team.repository';
import { WorkshopRepository } from '../workshop/workshop.repository';
import { ShiftScheduleRepository } from '../shift-schedule/shift-schedule.repository';

@Injectable()
export class ShiftManagementService {
  constructor(
    private readonly attendanceTypeRepository: AttendanceTypeRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeShiftRepository: EmployeeShiftRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly shiftScheduleRepository: ShiftScheduleRepository,
    private readonly teamRepository: TeamRepository,
    private readonly workshopRepository: WorkshopRepository,
  ) {}

  async createShift(profile: IProfile): Promise<ISuccess> {
    const workshop = await this.getWorkshop(profile.workshopCode);
    const team = await this.getTeam(profile.teamNumber);

    // проверяем цех и график
    if (
      profile.workshopCode === EWorkshop.W_LPC11 &&
      profile.scheduleCode === ESchedule.S_5B1
    ) {
      const currentShfitFor5B1 = getShiftFor5B1();
      const currentShiftFor91 = getShiftFor9(1);
      const currentShiftFor92 = getShiftFor9(2);

      if (currentShfitFor5B1.isWorking) {
        console.log('5-Б-1: рабочий день');
      }

      if (!currentShfitFor5B1.isWorking) {
        console.log('5-Б-1: выходной');
      }

      if (currentShiftFor91.shiftCode) {
        console.log('9-1: рабочий день');
      }

      if (!currentShiftFor91.shiftCode) {
        console.log('9-1: выходной');
      }

      if (currentShiftFor92.shiftCode) {
        console.log('9-2: рабочий день');
      }

      if (!currentShiftFor92.shiftCode) {
        console.log('9-2: выходной');
      }

      // проверяем существование смены
      // await this.checkShiftExistence(
      //   workshop.id,
      //   team.id,
      //   currentShfitFor5B1.date,
      // );

      // создаем смену
    }

    return { message: 'Hello, World!' };
  }

  private async checkShiftExistence(
    workshopId: string,
    teamId: string,
    date: Date,
  ): Promise<{ message: string } | null> {
    const exists = await this.shiftRepository.existsByWorkshopTeamDate(
      workshopId,
      teamId,
      date,
    );

    if (exists) {
      console.log('Смена уже существует');
      return { message: 'Смена уже существует' };
    }

    console.log('Смены нет, создаем');
    return null;
  }

  async createShift_2(profile: IProfile): Promise<ISuccess> {
    const strategy = this.getShiftCreationStrategy(profile);
    return strategy(profile);
  }

  private async getWorkshop(
    workshopCode: string | null,
  ): Promise<Workshop | null> {
    if (workshopCode === null) {
      return null;
    }

    const workshop =
      await this.workshopRepository.findWorkshopByCode(workshopCode);

    if (!workshop) {
      throw new NotFoundException('Цех не найден');
    }

    return workshop;
  }

  private async getTeam(teamNumber: number | null): Promise<Team | null> {
    if (teamNumber === null) {
      return null;
    }

    const team = await this.teamRepository.findTeamByTeamNumber(teamNumber);

    if (!team) {
      throw new NotFoundException('Номер бригады не найден');
    }

    return team;
  }

  private async getShiftSchedule(
    dayOfWeek: number | null,
    workshopCode: string | null,
    scheduleCode: string | null,
    shiftNumber: number | null,
  ): Promise<ShiftSchedule | null> {
    if (
      dayOfWeek === null ||
      workshopCode === null ||
      scheduleCode === null ||
      shiftNumber === null
    ) {
      return null;
    }

    const shiftSchedule =
      await this.shiftScheduleRepository.findShiftScheduleBy(
        dayOfWeek,
        workshopCode,
        scheduleCode,
        shiftNumber,
      );

    if (!shiftSchedule) {
      throw new NotFoundException('Расписание смены не найдено');
    }

    return shiftSchedule;
  }

  private isRelevantShift(
    currentShift: { shiftCode: number; date: Date },
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

  private async getEmployees(
    teamNumber: number | null,
    workshopCode: string | null,
    scheduleCode: string | null,
  ): Promise<Employee[]> {
    const employees = await this.employeeRepository.findAllWithWorkshopAndTeam(
      teamNumber,
      workshopCode,
      scheduleCode,
    );

    if (employees.length === 0) {
      throw new NotFoundException('Сотрудники не найдены');
    }

    return employees;
  }

  async getAttendanceType(code: string): Promise<AttendanceType> {
    const attendanceType =
      await this.attendanceTypeRepository.findAttendanceTypeByCode(code);

    if (!attendanceType) {
      throw new Error(`Тип посещаемости ${code} не найден в базе данных`);
    }

    return attendanceType;
  }

  private getShiftCreationStrategy(
    profile: IProfile,
  ): (p: IProfile) => Promise<ISuccess> {
    const { workshopCode, scheduleCode } = profile;

    // График 2-А
    // Цеха: ЛПЦ-5, ЛПЦ-11, ПМП (СБ)
    if (
      scheduleCode === ESchedule.S_2A &&
      [EWorkshop.W_LPC5, EWorkshop.W_LPC11, EWorkshop.W_PMP_North].includes(
        workshopCode as EWorkshop,
      )
    ) {
      return (p) => this.createShiftForLpc112A(p);
    }

    // График 5-Б-1
    // Цеха: ЛПЦ-11
    if (
      scheduleCode === ESchedule.S_5B1 &&
      [EWorkshop.W_LPC11].includes(workshopCode as EWorkshop)
    ) {
      return (p) => this.createShiftForLpc115B1(p);
    }

    throw new BadRequestException(
      `Не поддерживается комбинация: цех ${workshopCode}, график ${scheduleCode}`,
    );
  }

  private async createShiftForLpc112A(profile: IProfile): Promise<ISuccess> {
    const today = getUTCToday();
    const tomorrow = getUTCTomorrow();
    const currentShift = getShiftFor2A(profile.teamNumber);

    if (!this.isRelevantShift(currentShift, today, tomorrow)) {
      return { message: 'Смен нет' };
    }

    // 1. Получаем все необходимые сущности

    const [workshop, team, shiftSchedule, employees, attendanceType] =
      await Promise.all([
        this.getWorkshop(profile.workshopCode),
        this.getTeam(currentShift.teamNumber),
        this.getShiftSchedule(
          0, // график 2-А (универсальный, день - 0)
          profile.workshopCode,
          profile.scheduleCode,
          currentShift.shiftCode,
        ),
        this.getEmployees(
          profile.teamNumber,
          profile.workshopCode,
          profile.scheduleCode,
        ),
        this.getAttendanceType(EAttendanceCode.Y),
      ]);

    // 2. Проверяем смену на существоание
    const existingShift = await this.shiftRepository.existsByWorkshopTeamDate(
      workshop.id,
      team.id,
      currentShift.date,
    );

    if (existingShift) {
      return { message: 'Смена уже существует' };
    }

    // 3. Создаём смену ТОЛЬКО если её нет
    try {
      const newShift = await this.shiftRepository.create({
        date: currentShift.date,
        team,
        workshop,
        shiftSchedule,
      });

      // 4. Создаём записи для сотрудников
      const employeeShifts = await Promise.all(
        employees.map(async (employee) => {
          const scheduleCode = employee.position?.schedule?.scheduleCode;
          const workshopCode = employee.position?.workshop?.workshopCode;

          const shiftSchedule =
            await this.shiftScheduleRepository.findShiftScheduleBy(
              0,
              workshopCode,
              scheduleCode,
              currentShift.shiftCode,
            );

          const hours = shiftSchedule ? calcShiftDuration(shiftSchedule) : 0;

          return this.employeeShiftRepository.create({
            hours,
            employee,
            shift: newShift,
            attendanceType,
            currentProfession: employee.position?.profession,
            workPlace: null,
          });
        }),
      );

      console.log(
        'Смены работников:',
        employeeShifts.map((es) => ({
          employeeId: es.employee.id,
          employeeName: `${es.employee.lastName} ${es.employee.firstName}`,
          hours: es.hours,
          attendanceCode: es.attendanceType.attendanceCode,
          profession: es.currentProfession?.name,
        })),
      );

      return { message: 'Смена успешно создана' };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return { message: 'Смена уже создана' };
      }

      throw new InternalServerErrorException(
        `Не удалось создать смену: ${error}`,
      );
    }
  }

  private async createShiftForLpc115B1(profile: IProfile): Promise<ISuccess> {
    const dayInfo = getShiftFor5B1();

    // здесь будет реальная логика под этот кейс
    return { message: 'Логика бр5' };
  }
}
