import { QueryFailedError } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { normalizeScheduleCode } from '../../shared/utils/utils';
import {
  EAttendanceCode,
  EPaymentCode,
  ESchedule,
} from '../../shared/enums/enums';
import { ISuccess } from '../../shared/interfaces/api.interface';

import { CreateEmployeeShiftDto } from './dto/create-employee-shift.dto';
import { DeleteEmployeeShiftDto } from './dto/delete-employee-shift.dto';
import { UpdateEmployeeShiftDto } from './dto/update-employee-shift.dto';

import { AttendanceType } from '../attendance-type/entities/attendance-type.entity';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeShift } from '../employee-shift/entities/employee-shift.entity';
import { Shift } from '../shift/entities/shift.entity';
import { ShiftSchedule } from '../shift-schedule/entities/shift-schedule.entity';

import { EmployeeShiftRepository } from '../employee-shift/employee-shift.repository';

import { AttendanceTypeService } from '../attendance-type/attendance-type.service';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeShiftService } from '../employee-shift/employee-shift.service';
import { ShiftScheduleService } from '../shift-schedule/shift-schedule.service';
import { ShiftService } from '../shift/shift.service';
import { WorkplaceService } from '../work-place/work-place.service';

@Injectable()
export class EmployeeShiftManagementService {
  constructor(
    private readonly employeeShiftRepository: EmployeeShiftRepository,
    private readonly attendanceTypeService: AttendanceTypeService,
    private readonly employeeService: EmployeeService,
    private readonly employeeShiftService: EmployeeShiftService,
    private readonly shiftService: ShiftService,
    private readonly shiftScheduleService: ShiftScheduleService,
    private readonly workplaceService: WorkplaceService,
  ) {}

  async createEmployeeShiftByPersonalNumber(
    dto: CreateEmployeeShiftDto,
  ): Promise<ISuccess> {
    const employee = await this.employeeService.getEmployeeByPersonalNumber(
      dto.personalNumber,
    );

    const shift = await this.shiftService.getShiftById(dto.shiftId);

    const isHoliday = !shift.shiftSchedule;

    const attendanceType = await this.attendanceTypeService.getAttendanceType(
      isHoliday ? EAttendanceCode.V : EAttendanceCode.Y,
    );

    const minutes = isHoliday
      ? 0
      : this.calculateShiftDuration(shift.shiftSchedule);

    const isPresent = isHoliday ? null : true;

    // ВАЖНО!!! Логику дописать в будущем
    // Это самое главное поле - готовность табеля за смену у сотрудника
    // Сценарии: чужой - false, распоряжение не забыть подумать
    // Нужно подумать
    const isReady = false;

    // ВАЖНО!!! Логику дописать в будущем
    // Текущая позиция должна вычисляться
    // Либо распоряжение, либо штатная позиция
    // Таблицы распоряжений нет на данный момент, грузим из сотрудника
    const currentPosition = employee.position;

    try {
      await this.employeeShiftRepository.create({
        minutes,
        isPresent,
        isReady,
        employee,
        shift,
        currentPosition,
        attendanceType,
        workplace: null,
      });
    } catch (error) {
      this.handleNoticeError(error);
    }

    return {
      message: 'Смена работника создана успешно',
    };
  }

  async createEmployeeShiftsForWork(
    dayOfWeek: number,
    shiftCode: number,
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    for (const employee of employees) {
      const workshopCode = employee.position.workshop.workshopCode;
      const scheduleCode = employee.position.schedule.scheduleCode;

      // ВАЖНО!!! Логику дописать в будущем
      // Это самое главное поле - готовность табеля за смену у сотрудника
      // Сценарии: свой - распоряжений нет - рабочее место не омечено - false и тд
      // Нужно подумать
      const isReady = false;

      // ВАЖНО!!! Логику дописать в будущем
      // Текущая позиция должна вычисляться
      // Либо распоряжение, либо штатная позиция
      // Таблицы распоряжений нет на данный момент, грузим из сотрудника
      const currentPosition = employee.position;

      const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
        dayOfWeek,
        workshopCode,
        scheduleCode,
        shiftCode,
      );

      const minutes = this.calculateShiftDuration(shiftSchedule);

      await this.employeeShiftRepository.create({
        minutes,
        isPresent: true,
        isReady,
        employee,
        shift,
        currentPosition,
        attendanceType,
        workplace: null,
      });
    }
  }

  async createEmployeeShiftsForHoliday(
    shift: Shift,
    employees: Employee[],
    attendanceType: AttendanceType,
  ): Promise<void> {
    for (const employee of employees) {
      // ВАЖНО!!! Логику дописать в будущем
      // Это самое главное поле - готовность табеля за смену у сотрудника
      // Сценарии: выходной - свой - true, распоряжение не забыть подумать
      // Нужно подумать
      const isReady = true;

      // ВАЖНО!!! Логику дописать в будущем
      // Текущая позиция должна вычисляться
      // Либо распоряжение, либо штатная позиция
      // Таблицы распоряжений нет на данный момент, грузим из сотрудника
      const currentPosition = employee.position;

      await this.employeeShiftRepository.create({
        minutes: 0,
        isPresent: null,
        isReady,
        employee,
        shift,
        currentPosition,
        attendanceType,
        workplace: null,
      });
    }
  }

  async updateEmployeeShift(dto: UpdateEmployeeShiftDto): Promise<ISuccess> {
    // Получаем смену сотрудника со всеми связями
    const employeeShift = await this.employeeShiftService.getEmployeeShift(
      dto.employeeShiftId,
    );

    // Получаем связанные сущности
    const shift = employeeShift.shift;
    const employee = employeeShift.employee;

    const attendanceType = await this.attendanceTypeService.getAttendanceType(
      dto.attendanceCode,
    );

    // Запускаем валидацию согласованности
    this.validateShiftConsistency(employeeShift, dto);

    // Проверяем, нужно ли создать уведомление о документе
    const isCreateNotice = this.shouldCreateDocument(shift, employee, dto);

    if (isCreateNotice) {
      console.log('Создаём уведомление о документе');
    }

    if (dto.workplaceName) {
      // Если рабочее место есть — ищем. Если не найдётся, тут вылетит NotFoundException (как и задумано)
      // employeeShift.workplace = await this.workplaceService.getWorkplace(
      //   dto.workplaceName,
      //   shift.workshop.workshopCode,
      //   dto.currentProfessionCode,
      // );
    } else {
      employeeShift.workplace = null;
    }

    // Получаем минуты из расписания графика (справочник из таблицы бд)
    const minutes = await this.getShiftDurationMinutes(shift);

    // ВАЖНО!!! Нужно время брать из позиции которая выбрана, сейчас из смены - это не правильно
    // Проверяем диапозон минут
    if (dto.minutes < 0 || dto.minutes > minutes) {
      throw new ConflictException('Введите другое время');
    }

    if (dto.minutes !== minutes) {
      console.log('Заявление на часы');
      // ВАЖНО!!! Логики нет, просто для теста
      employeeShift.minutes = dto.minutes;
    } else {
      employeeShift.minutes = dto.minutes;
    }

    // Обновляем поля смены сотрудника (сущность EmployeeShift)
    employeeShift.isPresent = dto.isPresent;

    // Обновляем связи смены сотрудника (сущность EmployeeShift)
    employeeShift.attendanceType = attendanceType;

    // ВАЖНО!!! Логика проверки всех полей и всей связей сначала
    // Если все проверки прошли, то перед сохраненинем меняем на true
    employeeShift.isReady = true;

    // Сохранение изменений
    await this.employeeShiftRepository.save(employeeShift);

    return {
      message: 'Смена сотрудника обновлена успешно',
    };
  }

  private validateShiftConsistency(
    employeeShift: EmployeeShift,
    dto: UpdateEmployeeShiftDto,
  ): void {
    const isHoliday = employeeShift.shift.shiftSchedule === null;

    if (isHoliday) {
      this.validateHolidayShift(employeeShift, dto);
      return;
    }

    this.validateWorkShift(employeeShift, dto);
  }

  private validateHolidayShift(
    employeeShift: EmployeeShift,
    dto: UpdateEmployeeShiftDto,
  ): void {
    // График 5-Б-1
    const isSpecialSchedule =
      employeeShift.shift.schedule.scheduleCode === ESchedule.S_5B1;

    if (isSpecialSchedule) {
      this.validateSpecialScheduleRules(employeeShift, dto);
      return;
    }

    // Всем остальным графикам явка запрещена в выходной день
    if (dto.attendanceCode === EAttendanceCode.Y) {
      throw new ConflictException('Явка запрещена');
    }

    this.validateOtherHolidayRules(employeeShift, dto);
  }

  private validateSpecialScheduleRules(
    employeeShift: EmployeeShift,
    dto: UpdateEmployeeShiftDto,
  ): void {
    // Оплата только РВ
    if (
      dto.currentPaymentCode !==
        employeeShift.currentPosition.paymentSystem.paymentCode &&
      dto.currentPaymentCode !== EPaymentCode.RV
    ) {
      throw new ConflictException('Измените оплату');
    }

    // Время: если статус явка — минуты должны быть > 0
    // Время: если статус не явка — минут быть не должно
    if (
      (dto.minutes === 0 && dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.minutes > 0 && !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените время или статус');
    }

    // Время: если тип оплаты: РВ — минуты должны быть > 0
    // Время: если тип оплаты: не РВ — минут быть не должно
    if (
      (dto.minutes === 0 && dto.currentPaymentCode === EPaymentCode.RV) ||
      (dto.minutes > 0 && !(dto.currentPaymentCode === EPaymentCode.RV))
    ) {
      throw new ConflictException('Измените время или статус');
    }

    // Согласованность СВС и статуса
    if (
      (dto.isPresent === null && dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.isPresent !== null && !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените СВС или статус');
    }

    // Согласованность рабочего места и статуса
    if (
      (dto.workplaceName === null &&
        dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.workplaceName !== null &&
        !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените место или статус');
    }
  }

  private validateOtherHolidayRules(
    employeeShift: EmployeeShift,
    dto: UpdateEmployeeShiftDto,
  ): void {
    if (
      dto.currentPositionCode !== employeeShift.currentPosition.positionCode
    ) {
      throw new ConflictException('Нельзя изменить позицию');
    }

    if (
      dto.currentPaymentCode !==
      employeeShift.currentPosition.paymentSystem.paymentCode
    ) {
      throw new ConflictException('Нельзя изменить оплату');
    }

    if (dto.minutes > 0) {
      throw new ConflictException('Удалите время');
    }

    if (dto.isPresent !== null) {
      throw new ConflictException('Удалите посещение СВС');
    }

    if (dto.workplaceName !== null) {
      throw new ConflictException('Удалите рабочее место');
    }
  }

  private validateWorkShift(
    employeeShift: EmployeeShift,
    dto: UpdateEmployeeShiftDto,
  ): void {
    const paymentCodes = [
      EAttendanceCode.DSR,
      EAttendanceCode.OSR,
      EAttendanceCode.RV,
    ];

    // Нельзя выбрать ДСР, ОСР, РВ для работника по КЛС в этой бригаде и цехе
    if (
      employeeShift.shift.workshop.workshopCode ===
        employeeShift.employee.position.workshop.workshopCode &&
      employeeShift.shift.team.teamNumber ===
        employeeShift.employee.team.teamNumber &&
      paymentCodes.includes(dto.currentPaymentCode as EAttendanceCode)
    ) {
      throw new ConflictException('Измените оплату труда');
    }

    // Время: если статус явка — минуты должны быть > 0
    // Время: если статус не явка — минут быть не должно
    if (
      (dto.minutes === 0 && dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.minutes > 0 && !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените время или статус');
    }

    // Согласованность СВС и статуса
    if (
      (dto.isPresent === null && dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.isPresent !== null && !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените СВС или статус');
    }

    // Согласованность рабочего места и статуса
    if (
      (dto.workplaceName === null &&
        dto.attendanceCode === EAttendanceCode.Y) ||
      (dto.workplaceName !== null &&
        !(dto.attendanceCode === EAttendanceCode.Y))
    ) {
      throw new ConflictException('Измените место или статус');
    }
  }

  private shouldCreateDocument(
    shift: Shift,
    employee: Employee,
    dto: UpdateEmployeeShiftDto,
  ): boolean {
    const isHoliday = shift.shiftSchedule === null;

    if (isHoliday) {
      const isSpecialSchedule = shift.schedule.scheduleCode === ESchedule.S_5B1;

      if (isSpecialSchedule) {
        // Для 5-Б-1: документ нужен, если есть отработанные минуты ИЛИ есть изменения
        return dto.minutes > 0 || this.hasShiftChanges(shift, employee, dto);
      }

      // Для остальных графиков в выходной документ не создаётся
      return false;
    }

    // В рабочий день документ нужен при наличии изменений
    return this.hasShiftChanges(shift, employee, dto);
  }

  private hasShiftChanges(
    shift: Shift,
    employee: Employee,
    dto: UpdateEmployeeShiftDto,
  ): boolean {
    return (
      shift.workshop.workshopCode !== employee.position.workshop.workshopCode ||
      shift.team.teamNumber !== employee.team.teamNumber ||
      employee.position.positionCode !== dto.currentPositionCode ||
      employee.position.paymentSystem.paymentCode !== dto.currentPaymentCode
    );
  }

  async deleteEmployeeShift(dto: DeleteEmployeeShiftDto): Promise<ISuccess> {
    const shift = await this.shiftService.getShiftById(dto.shiftId);

    // Ищем нужную запись смены сотрудника в уже загруженной смене
    const employeeShift = shift.employeeShifts.find(
      (es) => es.id === dto.employeeShiftId,
    );

    if (!employeeShift) {
      throw new NotFoundException(
        `Смена сотрудника с ID ${dto.employeeShiftId} не найдена в смене ${dto.shiftId}`,
      );
    }

    // Спецправило для ЛПЦ-11: нельзя удалять при графике 2 или 2‑А
    // Нормализуем график сотрудника для ЛПЦ‑11: 2 → 2‑А
    const normalizedEmployeeScheduleCode = normalizeScheduleCode(
      employeeShift.employee.position.workshop.workshopCode,
      employeeShift.employee.position.schedule.scheduleCode,
    );

    // Базовое правило «сотрудник по КЛС» — нельзя удалять, если все параметры совпадают
    const isNative =
      shift.workshop.workshopCode ===
        employeeShift.employee.position.workshop.workshopCode &&
      shift.team.teamNumber === employeeShift.employee.team.teamNumber &&
      shift.schedule.scheduleCode === normalizedEmployeeScheduleCode;

    if (isNative) {
      throw new ConflictException('Сотрудник по КЛС');
    }

    // Если всё ок — удаляем
    await this.employeeShiftService.deleteEmployeeShift(employeeShift.id);

    return { message: 'Смена сотрудника успешно удалена' };
  }

  private async getShiftDurationMinutes(shift: Shift): Promise<number> {
    // Если shiftSchedule = null (выходной), то
    // График 5-Б-1 dayOfWeek = 1 (понедельник)
    // График 2-А и 9 dayOfWeek = 0 (универсальный)
    // У всех расписаний shiftCode = 2 (смена 2 - дневная)
    const dayOfWeek = shift.shiftSchedule?.dayOfWeek ?? null;

    const resolvedDayOfWeek =
      dayOfWeek === null
        ? shift.schedule.scheduleCode === ESchedule.S_5B1
          ? 1
          : 0
        : dayOfWeek;

    const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
      resolvedDayOfWeek,
      shift.workshop.workshopCode,
      shift.schedule.scheduleCode,
      shift.shiftSchedule?.shiftType?.shiftCode ?? 2,
    );

    return this.calculateShiftDuration(shiftSchedule);
  }

  private calculateShiftDuration(schedule: ShiftSchedule | null): number {
    if (!schedule) {
      return 0;
    }

    const toMin = (t: string | null): number => {
      if (!t) return 0;
      // Безопасный парсинг времени ЧЧ:ММ
      const [hStr, mStr] = t.split(':');
      const h = Number(hStr ?? 0);
      const m = mStr ? Number(mStr) : 0;

      // Защита от некорректных данных
      if (isNaN(h) || isNaN(m)) return 0;

      return h * 60 + m;
    };

    const start = toMin(schedule.startTime);
    let end = toMin(schedule.endTime);

    // Если конец раньше начала — смена пересекает полночь
    if (end < start) {
      end += 24 * 60; // +1440 минут
    }

    let lunchDuration = 0;
    if (schedule.lunchStart && schedule.lunchEnd) {
      const ls = toMin(schedule.lunchStart);
      const le = toMin(schedule.lunchEnd);

      lunchDuration = le - ls;

      // Обед тоже может пересекать полночь (редко, но бывает)
      if (lunchDuration < 0) {
        lunchDuration += 24 * 60;
      }
    }

    const totalMinutes = Math.max(0, end - start - lunchDuration);

    // Возвращаем сразу минуты (целое число), без округления до четверти часа
    return Math.round(totalMinutes);
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
        throw new ConflictException('Работник уже добавлен');
      }

      // Если это QueryFailedError, но не про уникальность — лучше пробросить как конфликт или серверную ошибку
      throw new ConflictException(
        'Не удалось добавить работника: конфликт данных',
      );
    }

    // Для всех остальных ошибок — стандартная серверная ошибка
    throw new InternalServerErrorException(
      `Не удалось добавить работника: ${error}`,
    );
  }
}
