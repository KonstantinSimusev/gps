// import { QueryFailedError } from 'typeorm';

// import {
//   ConflictException,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';

// import {
//   getScheduleConfigsToNitice,
//   getShiftFor2A,
//   getShiftFor5B1,
//   getShiftFor9,
//   isCondition_2A,
//   isCondition_2A_9,
//   isCondition_5B1,
//   isCondition_5B1_9,
//   isRelevantShift,
//   normalizeScheduleCode,
// } from '../../shared/utils/utils';

// import { ShiftDateDto } from './dto/shift-date.dto';

// import {
//   EAttendanceCode,
//   ESchedule,
//   EWorkshop,
// } from '../../shared/enums/enums';

// import {
//   IProfile,
//   IShift,
//   ISuccess,
//   IShiftInfo,
//   IEmployeeShift,
//   IEmployee,
// } from '../../shared/interfaces/api.interface';

// import { AttendanceType } from '../attendance-type/entities/attendance-type.entity';
// import { Employee } from '../employee/entities/employee.entity';
// import { EmployeeShift } from '../employee-shift/entities/employee-shift.entity';
// import { Schedule } from '../schedule/entities/schedule.entity';
// import { Shift } from '../shift/entities/shift.entity';
// import { Team } from '../team/entities/team.entity';
// import { Workshop } from '../workshop/entities/workshop.entity';

// import { ShiftRepository } from '../shift/shift.repository';

// import { AttendanceTypeService } from '../attendance-type/attendance-type.service';
// import { EmployeeShiftManagementService } from '../employee-shift-management/employee-shift-management.service';
// import { ScheduleService } from '../schedule/schedule.service';
// import { ShiftScheduleService } from '../shift-schedule/shift-schedule.service';
// import { ShiftService } from '../shift/shift.service';
// import { TeamService } from '../team/team.service';
// import { WorkshopService } from '../workshop/workshop.service';
// import { ShiftIdDto } from './dto/shift-id.dto';
// import { EmployeeManagementService } from '../employee-management/employee-management.service';

// @Injectable()
// export class ShiftManagementService {
//   constructor(
//     private readonly shiftRepository: ShiftRepository,
//     private readonly attendanceTypeService: AttendanceTypeService,
//     private readonly employeeManagementService: EmployeeManagementService,
//     private readonly employeeShiftManagementService: EmployeeShiftManagementService,
//     private readonly scheduleService: ScheduleService,
//     private readonly shiftScheduleService: ShiftScheduleService,
//     private readonly shiftService: ShiftService,
//     private readonly teamService: TeamService,
//     private readonly workshopService: WorkshopService,
//   ) {}

//   async getShiftsWithAutoCreate(profile: IProfile): Promise<IShift[]> {
//     let shifts = await this.getShifts(profile);

//     if (shifts.length === 0) {
//       await this.createShifts(profile);
//       shifts = await this.getShifts(profile);
//     }

//     return shifts;
//   }

//   async createShifts(profile: IProfile): Promise<ISuccess> {
//     const strategies = this.getShiftStrategies(profile);

//     if (strategies.length === 0) {
//       return {
//         message: 'Нет стратегий',
//       };
//     }

//     for (const strategy of strategies) {
//       await strategy(profile);
//     }

//     return {
//       message: 'Смены созданы успешно',
//     };
//   }

//   async getShifts(profile: IProfile): Promise<IShift[]> {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     // Получаем сущности
//     const workshop =
//       await this.workshopService.getWorkshop(profileWorkshopCode);
//     const team = await this.teamService.getTeam(profileTeamNumber);
//     const schedule =
//       await this.scheduleService.getScheduleByCode(profileScheduleCode);

//     // Сегодня в UTC 00:00
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     // Завтра = сегодня + 1 день
//     const tomorrow = new Date(today);
//     tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

//     // Вчера = сегодня - 1 день
//     const yesterday = new Date(today);
//     yesterday.setUTCDate(yesterday.getUTCDate() - 1);

//     const allShifts: Shift[] = [];

//     // График: 2-A, все цехи
//     if (isCondition_2A(profileWorkshopCode, profileScheduleCode)) {
//       const currentShift = getShiftFor2A(profileTeamNumber);

//       // Если смена 1 завтра
//       if (
//         currentShift.shiftCode === 1 &&
//         this.getUTCDateString(currentShift.date) ===
//           this.getUTCDateString(tomorrow)
//       ) {
//         const [workShft, holidayShft] = await Promise.all([
//           this.shiftService.getShiftByDate(
//             tomorrow,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//           this.shiftService.getShiftByDate(
//             today,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//         ]);

//         allShifts.push(workShft, holidayShft);
//       }

//       // Если смена 1 сегодня
//       if (
//         currentShift.shiftCode === 1 &&
//         this.getUTCDateString(currentShift.date) ===
//           this.getUTCDateString(today)
//       ) {
//         const [workShft, holidayShft] = await Promise.all([
//           this.shiftService.getShiftByDate(
//             today,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//           this.shiftService.getShiftByDate(
//             yesterday,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//         ]);

//         allShifts.push(workShft, holidayShft);
//       }

//       // Если смена 2 сегодня
//       if (currentShift.shiftCode === 2) {
//         const [workShft, holidayShft] = await Promise.all([
//           this.shiftService.getShiftByDate(
//             today,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//           this.shiftService.getShiftByDate(
//             yesterday,
//             workshop.id,
//             team.id,
//             schedule.id,
//           ),
//         ]);

//         allShifts.push(workShft, holidayShft);
//       }
//     }

//     // График: 5-Б-1, все цехи
//     if (isCondition_5B1(profileWorkshopCode, profileScheduleCode)) {
//       const shift = await this.shiftService.getShiftByDate(
//         today,
//         workshop.id,
//         team.id,
//         schedule.id,
//       );

//       allShifts.push(shift);
//     }

//     // График 9 отображаем в графике 5-Б-1
//     if (isCondition_5B1_9(profileWorkshopCode, profileScheduleCode)) {
//       const schedule9 = await this.scheduleService.getScheduleByCode(
//         ESchedule.S_9,
//       );

//       const [team91, team92] = await Promise.all([
//         this.teamService.getTeam(1),
//         this.teamService.getTeam(2),
//       ]);

//       const [shift91, shift92] = await Promise.all([
//         this.shiftService.getShiftByDate(
//           today,
//           workshop.id,
//           team91.id,
//           schedule9.id,
//         ),
//         this.shiftService.getShiftByDate(
//           today,
//           workshop.id,
//           team92.id,
//           schedule9.id,
//         ),
//       ]);

//       allShifts.push(shift91, shift92);
//     }

//     // График 9 отображаем в графике 2-А
//     if (isCondition_2A_9(profileWorkshopCode, profileScheduleCode)) {
//       // Сегодня в UTC 00:00
//       const today = new Date();
//       today.setUTCHours(0, 0, 0, 0);

//       // Завтра = сегодня + 1 день
//       const tomorrow = new Date(today);
//       tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

//       // Получаем текущую смену
//       const currentShift = getShiftFor2A(profileTeamNumber);

//       if (isRelevantShift(currentShift) && currentShift.shiftCode === 2) {
//         const schedule9 = await this.scheduleService.getScheduleByCode(
//           ESchedule.S_9,
//         );

//         const [team91, team92] = await Promise.all([
//           this.teamService.getTeam(1),
//           this.teamService.getTeam(2),
//         ]);

//         const [shift91, shift92] = await Promise.all([
//           this.shiftService.getShiftByDate(
//             today,
//             workshop.id,
//             team91.id,
//             schedule9.id,
//           ),
//           this.shiftService.getShiftByDate(
//             today,
//             workshop.id,
//             team92.id,
//             schedule9.id,
//           ),
//         ]);

//         allShifts.push(shift91, shift92);
//       }
//     }

//     const validShifts = allShifts.filter(
//       (shift): shift is Shift => shift !== null,
//     );

//     if (validShifts.length === 0) {
//       return [];
//     }

//     return this.mapShifts(validShifts);
//   }

//   async getShiftsByDay(
//     dto: ShiftDateDto,
//     profile: IProfile,
//   ): Promise<IShift[]> {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     const targetDate = new Date(dto.shiftDate);
//     targetDate.setUTCHours(0, 0, 0, 0);

//     const [workshop, team, schedule] = await Promise.all([
//       this.workshopService.getWorkshop(profileWorkshopCode),
//       this.teamService.getTeam(profileTeamNumber),
//       this.scheduleService.getScheduleByCode(profileScheduleCode),
//     ]);

//     const allShifts: Shift[] = [];

//     // 2-A
//     if (isCondition_2A(profileWorkshopCode, profileScheduleCode)) {
//       const shifts = await this.shiftService.getAllShiftByDate(
//         targetDate,
//         workshop.id,
//         team.id,
//         schedule.id,
//       );

//       allShifts.push(...shifts);
//     }

//     // 5-Б-1
//     if (isCondition_5B1(profileWorkshopCode, profileScheduleCode)) {
//       const shifts = await this.shiftService.getAllShiftByDate(
//         targetDate,
//         workshop.id,
//         team.id,
//         schedule.id,
//       );

//       allShifts.push(...shifts);
//     }

//     // 9 в 5-Б-1
//     if (isCondition_5B1_9(profileWorkshopCode, profileScheduleCode)) {
//       const schedule9 = await this.scheduleService.getScheduleByCode(
//         ESchedule.S_9,
//       );

//       const [team91, team92] = await Promise.all([
//         this.teamService.getTeam(1),
//         this.teamService.getTeam(2),
//       ]);

//       const [shifts91, shifts92] = await Promise.all([
//         this.shiftService.getAllShiftByDate(
//           targetDate,
//           workshop.id,
//           team91.id,
//           schedule9.id,
//         ),
//         this.shiftService.getAllShiftByDate(
//           targetDate,
//           workshop.id,
//           team92.id,
//           schedule9.id,
//         ),
//       ]);

//       allShifts.push(...shifts91, ...shifts92);
//     }

//     // 9 в 2-А
//     if (isCondition_2A_9(profileWorkshopCode, profileScheduleCode)) {
//       const schedule9 = await this.scheduleService.getScheduleByCode(
//         ESchedule.S_9,
//       );

//       const [team91, team92] = await Promise.all([
//         this.teamService.getTeam(1),
//         this.teamService.getTeam(2),
//       ]);

//       const [shifts91, shifts92] = await Promise.all([
//         this.shiftService.getAllShiftByDate(
//           targetDate,
//           workshop.id,
//           team91.id,
//           schedule9.id,
//         ),
//         this.shiftService.getAllShiftByDate(
//           targetDate,
//           workshop.id,
//           team92.id,
//           schedule9.id,
//         ),
//       ]);

//       allShifts.push(...shifts91, ...shifts92);
//     }

//     if (allShifts.length === 0) {
//       throw new NotFoundException('Смены не найдены');
//     }

//     return this.mapShifts(allShifts);
//   }

//   async getShiftById(id: string): Promise<IShift> {
//     const shift = await this.shiftService.getShiftById(id);
//     return this.mapShift(shift);
//   }

//   // async getMissingShiftsDates(profile: IProfile): Promise<string[]> {
//   //   // Получаем конфигурации графиков/бригад, подходящие профилю
//   //   const configs = getScheduleConfigs(profile);

//   //   // Если подходящих конфигураций нет — возвращаем пустой массив
//   //   if (configs.length === 0) {
//   //     return [];
//   //   }

//   //   // Единственный источник диапазона дат
//   //   const allDateKeys = this.calculateReportRange(profile);

//   //   if (allDateKeys.length === 0) {
//   //     return [];
//   //   }

//   //   const workshop = await this.workshopService.getWorkshop(
//   //     profile.workshopCode,
//   //   );

//   //   const missing = new Set<string>();

//   //   for (const config of configs) {
//   //     const team = await this.teamService.getTeam(config.teamNumber);
//   //     const schedule = await this.scheduleService.getScheduleByCode(
//   //       config.scheduleCode,
//   //     );

//   //     const shifts = await this.shiftService.getAllInCurrentAndPreviousMonth(
//   //       workshop.id,
//   //       team.id,
//   //       schedule.id,
//   //     );

//   //     const shiftKeys = new Set(
//   //       shifts.map((s) => this.dateToKey(new Date(s.date))),
//   //     );

//   //     allDateKeys
//   //       .filter((key) => !shiftKeys.has(key))
//   //       .forEach((key) => missing.add(key));
//   //   }

//   //   return Array.from(missing);
//   // }

//   async getPendingShiftsIds(profile: IProfile): Promise<string[]> {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     // Получаем конфигурации графиков/бригад для профиля
//     const configs = getScheduleConfigsToNitice(
//       profileWorkshopCode,
//       profileTeamNumber,
//       profileScheduleCode,
//     );

//     // Выходим, если конфигураций нет
//     if (configs.length === 0) {
//       return [];
//     }

//     // Получаем цех по коду из профиля
//     const workshop =
//       await this.workshopService.getWorkshop(profileWorkshopCode);

//     // Собираем сюда ID проблемных смен
//     const ids: string[] = [];

//     for (const config of configs) {
//       // Получаем бригаду по номеру из конфигурации
//       const team = await this.teamService.getTeam(config.teamNumber);

//       // Получаем график по коду из конфигурации
//       const schedule = await this.scheduleService.getScheduleByCode(
//         config.scheduleCode,
//       );

//       // Получаем готовый диапазон дат: с 1-го числа прошлого месяца по сегодня (или завтра для 2А/см1)
//       const dateRange = this.calculateReportRange(profile);

//       // Берём первую дату диапазона — начало периода
//       const startDate = new Date(dateRange[0]);

//       // Берём последнюю дату диапазона — конец периода
//       const endDate = new Date(dateRange[dateRange.length - 1]);

//       // Загружаем все смены бригады за период одним запросом
//       const shifts = await this.shiftRepository.findAllInRange(
//         workshop.id,
//         team.id,
//         schedule.id,
//         startDate,
//         endDate,
//       );

//       // Фильтруем смены, где хотя бы один сотрудник без рабочего места, и собираем их ID
//       const pendingIds = shifts
//         .filter((shift) =>
//           shift.employeeShifts.some((es) => es.workplace === null),
//         )
//         .map((shift) => shift.id);

//       // УДАЛИТЬ!!! ПОСЛЕ СОЗДАНИЯ ЛОГИКИ ПО РАБОЧЕМУ МЕСТУ В СЕРВИСЕ СМЕНЫ МЕТОД CHEK
//       // const pendingIds = shifts
//       //   .filter((shift) => {
//       //     // Выходной день (нет расписания смены)
//       //     const isDayOff = !shift.shiftSchedule;

//       //     if (isDayOff) {
//       //       // Выходной + чекнутый → не возвращаем (всё ок)
//       //       // Выходной + не чекнутый → возвращаем (проблемная)
//       //       return !shift.isChecked;
//       //     }

//       //     // Рабочий день — возвращаем, если хотя бы один сотрудник без рабочего места
//       //     return shift.employeeShifts.some((es) => es.workplace === null);
//       //   })
//       //   .map((shift) => shift.id);

//       // Добавляем найденные ID в общий накопитель
//       ids.push(...pendingIds);
//     }

//     // Возвращаем итоговый список ID
//     return ids;
//   }

//   private async createShiftForSchedule(
//     workshopCode: string,
//     teamNumber: number,
//     scheduleCode: string,
//     shiftGetter: (teamNumber: number) => IShiftInfo,
//   ): Promise<void> {
//     // Получаем сущности
//     const workshop = await this.workshopService.getWorkshop(workshopCode);
//     const team = await this.teamService.getTeam(teamNumber);
//     const schedule = await this.scheduleService.getScheduleByCode(scheduleCode);

//     const workType = await this.attendanceTypeService.getAttendanceType(
//       EAttendanceCode.Y,
//     );

//     const holidayType = await this.attendanceTypeService.getAttendanceType(
//       EAttendanceCode.V,
//     );

//     // Формируем список сотрудников
//     const employees =
//       await this.employeeManagementService.getEmployeesForSchedule(
//         workshopCode,
//         teamNumber,
//         scheduleCode,
//       );

//     // Получаем текущую смену
//     const currentShift = shiftGetter(teamNumber);

//     try {
//       // График 2-A
//       if (scheduleCode === ESchedule.S_2A) {
//         // Сегодня в UTC 00:00
//         const today = new Date();
//         today.setUTCHours(0, 0, 0, 0);

//         // Завтра = сегодня + 1 день
//         const tomorrow = new Date(today);
//         tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

//         // Вчера = сегодня - 1 день
//         const yesterday = new Date(today);
//         yesterday.setUTCDate(yesterday.getUTCDate() - 1);

//         // Проверяем релевантность смены
//         if (!isRelevantShift(currentShift)) {
//           return;
//         }

//         // Если смена 1 завтра
//         if (
//           currentShift.shiftCode === 1 &&
//           this.getUTCDateString(currentShift.date) ===
//             this.getUTCDateString(tomorrow)
//         ) {
//           // Создаем рабочую смену
//           await this.createShiftForWork(
//             currentShift.dayOfWeek,
//             workshopCode,
//             scheduleCode,
//             currentShift.shiftCode,
//             tomorrow,
//             team,
//             workshop,
//             schedule,
//             employees,
//             workType,
//           );

//           // Создаем смену выходного дня
//           await this.createShiftForHoliday(
//             today,
//             team,
//             workshop,
//             schedule,
//             employees,
//             holidayType,
//           );
//         }

//         // Если смена 1 сегодня
//         if (
//           currentShift.shiftCode === 1 &&
//           this.getUTCDateString(currentShift.date) ===
//             this.getUTCDateString(today)
//         ) {
//           // Создаем рабочую смену
//           await this.createShiftForWork(
//             currentShift.dayOfWeek,
//             workshopCode,
//             scheduleCode,
//             currentShift.shiftCode,
//             today,
//             team,
//             workshop,
//             schedule,
//             employees,
//             workType,
//           );

//           // Создаем смену выходного дня
//           await this.createShiftForHoliday(
//             yesterday,
//             team,
//             workshop,
//             schedule,
//             employees,
//             holidayType,
//           );
//         }

//         // Если смена 2
//         if (currentShift.shiftCode === 2) {
//           // Создаем рабочую смену
//           await this.createShiftForWork(
//             currentShift.dayOfWeek,
//             workshopCode,
//             scheduleCode,
//             currentShift.shiftCode,
//             today,
//             team,
//             workshop,
//             schedule,
//             employees,
//             workType,
//           );

//           // Создаем смену выходного дня
//           await this.createShiftForHoliday(
//             yesterday,
//             team,
//             workshop,
//             schedule,
//             employees,
//             holidayType,
//           );
//         }
//       }

//       if (currentShift.shiftCode !== null) {
//         // Создаем рабочую смену
//         await this.createShiftForWork(
//           currentShift.dayOfWeek, // график 9 (универсальный, день - 0)
//           workshopCode,
//           scheduleCode,
//           currentShift.shiftCode,
//           currentShift.date,
//           team,
//           workshop,
//           schedule,
//           employees,
//           workType, // тип посещаемости 'Я'
//         );
//       } else {
//         // Создаем смену выходного дня
//         await this.createShiftForHoliday(
//           currentShift.date,
//           team,
//           workshop,
//           schedule,
//           employees,
//           holidayType, // тип посещаемости 'В'
//         );
//       }
//     } catch (error) {
//       this.handleShiftCreationError(error);
//     }
//   }

//   private async createShiftForWork(
//     dayOfWeek: number,
//     workshopCode: string,
//     scheduleCode: string,
//     shiftCode: number,
//     date: Date,
//     team: Team,
//     workshop: Workshop,
//     schedule: Schedule,
//     employees: Employee[],
//     attendanceType: AttendanceType,
//   ): Promise<void> {
//     // Находим расписание для рабочей смены
//     const shiftSchedule = await this.shiftScheduleService.getShiftSchedule(
//       dayOfWeek,
//       workshopCode,
//       scheduleCode,
//       shiftCode,
//     );

//     // Ищем смену
//     const count = await this.shiftRepository.countShifts(
//       date,
//       workshop.id,
//       team.id,
//       schedule.id,
//     );

//     if (count === 0) {
//       // Создаем рабочую смену
//       const shift = await this.shiftRepository.create({
//         date,
//         team,
//         workshop,
//         schedule,
//         shiftSchedule,
//       });

//       // Создаем рабочие смены сотрудников с типом посещаемости 'Я'
//       await this.employeeShiftManagementService.createEmployeeShiftsForWork(
//         dayOfWeek,
//         shiftCode,
//         shift,
//         employees,
//         attendanceType,
//       );
//     }
//   }

//   private async createShiftForHoliday(
//     date: Date,
//     team: Team,
//     workshop: Workshop,
//     schedule: Schedule,
//     employees: Employee[],
//     attendanceType: AttendanceType,
//   ): Promise<void> {
//     // Ищем смену
//     const count = await this.shiftRepository.countShifts(
//       date,
//       workshop.id,
//       team.id,
//       schedule.id,
//     );

//     if (count === 0) {
//       // Если нет — cоздаем смену выходного дня
//       const shift = await this.shiftRepository.create({
//         date,
//         team,
//         workshop,
//         schedule,
//         shiftSchedule: null, // расписания нет, потому что выходной день
//       });

//       // Создаем смены выходного дня сотрудников с типом посещаемости 'В'
//       await this.employeeShiftManagementService.createEmployeeShiftsForHoliday(
//         shift,
//         employees,
//         attendanceType,
//       );
//     }
//   }

//   private getShiftStrategies(
//     profile: IProfile,
//   ): ((p: IProfile) => Promise<void>)[] {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     const strategies: ((p: IProfile) => Promise<void>)[] = [];

//     // Сегодня и завтра в UTC 00:00 — от текущего момента
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

//     // График 2-A, все цехи
//     if (isCondition_2A(profileWorkshopCode, profileScheduleCode)) {
//       // Получаем текущую смену по графику 2-А
//       const currentShift = getShiftFor2A(profileTeamNumber);

//       // Добавляем стратегию только, если смена релевантна
//       if (isRelevantShift(currentShift)) {
//         strategies.push((p) => this.createShift_2A(p));
//       }
//     }

//     // График 5-Б-1, все цехи
//     if (isCondition_5B1(profileWorkshopCode, profileScheduleCode)) {
//       strategies.push((p) => this.createShift_5B1(p));
//     }

//     // График 91 создается графиком 5-Б-1
//     if (isCondition_5B1_9(profileWorkshopCode, profileScheduleCode)) {
//       strategies.push((p) => this.createShift_91(p));
//     }

//     // График 92 создается графиком 5-Б-1
//     if (isCondition_5B1_9(profileWorkshopCode, profileScheduleCode)) {
//       strategies.push((p) => this.createShift_92(p));
//     }

//     // График 91 создается графиком 2‑A
//     if (isCondition_2A_9(profileWorkshopCode, profileScheduleCode)) {
//       // Получаем текущую смену по графику 2-А
//       const currentShift = getShiftFor2A(profileTeamNumber);

//       // Добавляем стратегию только, если смена 2 и релевантна
//       if (isRelevantShift(currentShift) && currentShift.shiftCode === 2) {
//         strategies.push((p) => this.createShift_91(p));
//       }
//     }

//     // График 92 создается графиком 2‑A
//     if (isCondition_2A_9(profileWorkshopCode, profileScheduleCode)) {
//       // Получаем текущую смену по графику 2-А
//       const currentShift = getShiftFor2A(profileTeamNumber);

//       // Добавляем стратегию только, если смена 2 и релевантна
//       if (isRelevantShift(currentShift) && currentShift.shiftCode === 2) {
//         strategies.push((p) => this.createShift_92(p));
//       }
//     }

//     return strategies;
//   }

//   private createShift_2A(profile: IProfile): Promise<void> {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     return this.createShiftForSchedule(
//       profileWorkshopCode,
//       profileTeamNumber,
//       profileScheduleCode,
//       () => getShiftFor2A(profileTeamNumber),
//     );
//   }

//   private createShift_5B1(profile: IProfile): Promise<void> {
//     const { profileWorkshopCode, profileTeamNumber, profileScheduleCode } =
//       profile;

//     return this.createShiftForSchedule(
//       profileWorkshopCode,
//       profileTeamNumber,
//       profileScheduleCode,
//       () => getShiftFor5B1(profileTeamNumber),
//     );
//   }

//   private createShift_91(profile: IProfile): Promise<void> {
//     const { profileWorkshopCode } = profile;

//     return this.createShiftForSchedule(
//       profileWorkshopCode,
//       1,
//       ESchedule.S_9,
//       () => getShiftFor9(1),
//     );
//   }

//   private createShift_92(profile: IProfile): Promise<void> {
//     const { profileWorkshopCode } = profile;

//     return this.createShiftForSchedule(
//       profileWorkshopCode,
//       2,
//       ESchedule.S_9,
//       () => getShiftFor9(2),
//     );
//   }

//   private mapShifts(shifts: Shift[]): IShift[] {
//     return shifts.map((shift) => this.mapShift(shift));
//   }

//   private mapShift(shift: Shift): IShift {
//     return {
//       id: shift.id,
//       date: shift.date,
//       workshopCode: shift.workshop.workshopCode,
//       teamNumber: shift.team.teamNumber,
//       scheduleCode: shift.schedule.scheduleCode,
//       dayOfWeek: shift.shiftSchedule?.dayOfWeek ?? 0,
//       shiftCode: shift.shiftSchedule?.shiftType?.shiftCode ?? null,
//       employeeShifts: shift.employeeShifts.map((employeeShift: EmployeeShift) =>
//         this.mapEmployeeShift(
//           shift.workshop.workshopCode,
//           shift.team.teamNumber,
//           shift.schedule.scheduleCode,
//           employeeShift,
//         ),
//       ),
//     };
//   }

//   private mapEmployeeShift(
//     shiftWorkshopCode: string,
//     shiftTeamNumber: number,
//     shiftScheduleCode: string,
//     employeeShift: EmployeeShift,
//   ): IEmployeeShift {
//     return {
//       id: employeeShift.id,
//       isPresent: employeeShift.isPresent,
//       attendanceCode: employeeShift.attendanceType.attendanceCode,

//       // ВАЖНО!!! Текущая профессия загружается в приоритете из таблицы распоряжений - если нет, то из КЛС
//       // Сейчас таблицы распоряжений нет, поэтому взяли из КЛС
//       currentProfessionCode:
//         employeeShift.currentPosition.profession.professionCode,

//       // ВАЖНО!!! Текущая профессия загружается в приоритете из таблицы распоряжений - если нет, то из КЛС
//       // Сейчас таблицы распоряжений нет, поэтому взяли из КЛС
//       currentProfessionName:
//         employeeShift.currentPosition.profession.name,

//       // ВАЖНО!!! Текущая система оплаты труда загружается в приоритете из таблицы распоряжений - если нет, то из КЛС
//       // Сейчас таблицы распоряжений нет, поэтому взяли из КЛС
//       currentPaymentCode:
//         employeeShift.currentPosition.paymentSystem.paymentCode,

//       workplaceName: employeeShift.workplace?.name ?? null,
//       minutes: employeeShift.minutes,

//       // ВАЖНО!!! Логика не готова
//       isReady: employeeShift.isReady,

//       // Можно удалить смену сотрудника, если:
//       // 1) Табель НЕ готов (isReady === false)
//       // И
//       // 2) Сотрудник НЕ является «родным» для этой смены
//       canDelete: this.calculateCanDelete(
//         shiftWorkshopCode,
//         shiftTeamNumber,
//         shiftScheduleCode,
//         employeeShift,
//       ),

//       employee: this.mapEmployee(employeeShift.employee),
//     };
//   }

//   private mapEmployee(employee: Employee): IEmployee {
//     return {
//       id: employee.id,
//       lastName: employee.lastName,
//       firstName: employee.firstName,
//       patronymic: employee.patronymic,
//       personalNumber: employee.personalNumber,
//       workshopCode: employee.position.workshop.workshopCode,
//       teamNumber: employee.team.teamNumber,
//       positionCode: employee.position.positionCode,
//       professionCode: employee.position.profession.professionCode,
//       professionName: employee.position.profession.name,
//       gradeCode: employee.position.grade.gradeCode,
//       scheduleCode: employee.position.schedule.scheduleCode,
//       paymentCode: employee.position.paymentSystem.paymentCode,
//     };
//   }

//   private calculateCanDelete(
//     shiftWorkshopCode: string,
//     shiftTeamNumber: number,
//     shiftScheduleCode: string,
//     employeeShift: EmployeeShift,
//   ): boolean {
//     // Спецправило для ЛПЦ-11: нельзя удалять при графике 2 или 2‑А
//     // Нормализуем график сотрудника для ЛПЦ‑11: 2 → 2‑А
//     const normalizedEmployeeScheduleCode = normalizeScheduleCode(
//       employeeShift.employee.position.workshop.workshopCode,
//       employeeShift.employee.position.schedule.scheduleCode,
//     );

//     // Базовое правило «сотрудник по КЛС» — нельзя удалять, если все параметры совпадают
//     const isNative =
//       shiftWorkshopCode ===
//         employeeShift.employee.position.workshop.workshopCode &&
//       shiftTeamNumber === employeeShift.employee.team.teamNumber &&
//       shiftScheduleCode === normalizedEmployeeScheduleCode;

//     const canDelete = !employeeShift.isReady && !isNative;

//     return canDelete;
//   }

//   private isAssignmentComplete(shift: Shift): boolean {
//     return shift.employeeShifts.every((employeeShift) => {
//       if (employeeShift.workplace !== null) {
//         return true;
//       }

//       if (!employeeShift.attendanceType) {
//         return false;
//       }

//       return employeeShift.attendanceType.attendanceCode === EAttendanceCode.V;
//     });
//   }

//   private handleShiftCreationError(error: unknown): never {
//     if (error instanceof QueryFailedError) {
//       // Проверяем, похоже ли на нарушение уникального ограничения (частая причина «Смена уже создана»)
//       const isUniqueViolation =
//         error.message.includes('duplicate key') ||
//         error.message.includes('unique constraint') ||
//         error.message.includes('already exists');

//       if (isUniqueViolation) {
//         // return { message: 'Смена уже создана' };
//         throw new ConflictException('Смена уже создана');
//       }

//       // Если это QueryFailedError, но не про уникальность — лучше пробросить как конфликт или серверную ошибку
//       throw new ConflictException('Не удалось создать смену: конфликт данных');
//     }

//     // Для всех остальных ошибок — стандартная серверная ошибка
//     throw new InternalServerErrorException(
//       `Не удалось создать смену: ${error}`,
//     );
//   }

//   private getUTCDateString(date: Date): string {
//     return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
//   }

//   private isDifferentDay(dateA: Date, dateB: Date): boolean {
//     return this.getUTCDateString(dateA) !== this.getUTCDateString(dateB);
//   }

//   private dateToKey(date: Date): string {
//     const y = date.getUTCFullYear();
//     const m = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const d = String(date.getUTCDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`; // формат YYYY-MM-DD
//   }

//   private calculateReportRange(profile: IProfile): string[] {
//     const { profileTeamNumber, profileScheduleCode } = profile;

//     // Сегодня в UTC 00:00
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     if (profileScheduleCode === ESchedule.S_2A) {
//       const shift = getShiftFor2A(profileTeamNumber);

//       if (shift.shiftCode === 1 && this.isDifferentDay(today, shift.date)) {
//         return this.getRangeToTomorrow();
//       }
//     }

//     return this.getRangeToToday();
//   }

//   private getRangeToToday(): string[] {
//     return this.getRangeWithOffset(0);
//   }

//   private getRangeToTomorrow(): string[] {
//     return this.getRangeWithOffset(1);
//   }

//   private getRangeWithOffset(offset: number = 0): string[] {
//     // Сегодня в UTC 00:00
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     // Конец диапазона = сегодня + offset дней
//     const end = new Date(today);
//     end.setUTCDate(end.getUTCDate() + offset);

//     // 1-е число предыдущего месяца (с учётом перехода через год)
//     const y = today.getUTCFullYear();
//     const m = today.getUTCMonth();
//     const start =
//       m === 0
//         ? new Date(Date.UTC(y - 1, 11, 1)) // январь → декабрь прошлого года
//         : new Date(Date.UTC(y, m - 1, 1));

//     return this.getDateRange(start, end);
//   }

//   private getDateRange(start: Date, end: Date): string[] {
//     // Клонируем и нормализуем обе даты в UTC 00:00:00:000, чтобы убрать время и часовой пояс
//     const startUtc = new Date(start);
//     startUtc.setUTCHours(0, 0, 0, 0);

//     const endUtc = new Date(end);
//     endUtc.setUTCHours(0, 0, 0, 0);

//     // Если старт позже конца — возвращаем пустой массив (защита от ошибок)
//     if (startUtc > endUtc) {
//       return [];
//     }

//     const result: string[] = [];
//     const cursor = new Date(startUtc); // всегда работаем с копией, не мутируя оригинал

//     // Ключ конца диапазона для сравнения
//     const endKey = this.dateToKey(endUtc);

//     while (this.dateToKey(cursor) <= endKey) {
//       result.push(this.dateToKey(cursor));
//       cursor.setUTCDate(cursor.getUTCDate() + 1); // автоматически перейдёт на следующий месяц/год
//     }

//     return result;
//   }
// }
