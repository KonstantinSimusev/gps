import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { toDateString } from '../../shared/utils/utils';
import { ERole, ESchedule, EWorkshop } from '../../shared/enums/enums';

import { Employee } from '../employee/entities/employee.entity';
import { Position } from '../position/entities/position.entity';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  IAccountInfo,
  IEmployeeInfo,
  IList,
  IProfile,
} from '../../shared/interfaces/api.interface';

import { EmployeeRepository } from '../employee/employee.repository';

import { AccountService } from '../account/account.service';
import { GradeService } from '../grade/grade.service';
import { EmployeeService } from '../employee/employee.service';
import { PaymentSystemService } from '../payment-system/payment-system.service';
import { PositionService } from '../position/position.service';
import { ScheduleService } from '../schedule/schedule.service';
import { TeamService } from '../team/team.service';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,

    private readonly accountService: AccountService,
    private readonly employeeService: EmployeeService,
    private readonly gradeService: GradeService,
    private readonly paymentSystemService: PaymentSystemService,
    private readonly positionService: PositionService,
    private readonly scheduleService: ScheduleService,
    private readonly teamService: TeamService,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    profile?: IProfile,
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Получаем сущности нового сотрудника
    const team = await this.teamService.getTeam(dto.teamNumber);
    const profileTeam = await this.teamService.getTeam(dto.teamNumber);

    const position = await this.getEmployeePosition(
      dto.positionCode,
      dto.scheduleCode,
      dto.gradeCode,
      dto.paymentCode,
    );

    const profilePosition = await this.getEmployeePosition(
      dto.positionCode,
      dto.scheduleCode,
      dto.gradeCode,
      dto.paymentCode,
    );

    // Проверяем совместимость цеха работника и цеха пользователя (только если не массовая операция)
    if (
      !isManyOperation &&
      position.workshop.workshopCode !== profile.profileWorkshopCode
    ) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем соответствие бригады и графика по штатной позиции (КЛС)
    await this.validateTeamScheduleCompatibility(
      dto.teamNumber,
      dto.positionCode,
      dto.gradeCode,
      dto.scheduleCode,
      dto.paymentCode,
    );

    // Проверяем, не занято ли ФИО
    await this.employeeService.validateUniqueFullName(
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    // Проверяем уникальность личного номера
    await this.employeeService.validateUniquePersonalNumber(dto.personalNumber);

    // Проверяем дату рождения
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем условие - руководитель в бригаде может быть только один
    if (this.isManagerRole(position.role.name as ERole)) {
      await this.employeeService.existsTeamManager(
        team.id,
        position.workshop.id,
        position.schedule.id,
        position.role.id,
      );
    }

    // Создаем аккаунт
    const { account, initialPassword } =
      await this.accountService.createAсcount(
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    // Создаём сотрудника
    await this.employeeRepository.create({
      ...dto,
      account,
      team,
      position,
      profileTeam,
      profilePosition,
    });

    return {
      lastName: dto.lastName,
      firstName: dto.firstName,
      patronymic: dto.patronymic,
      login: account.login,
      password: initialPassword,
    };
  }

  async createMany(dtos: CreateEmployeesDto): Promise<IList<IAccountInfo>> {
    try {
      const employees = await Promise.all(
        dtos.employees.map((dto) => this.createEmployee(dto, undefined, true)),
      );

      return {
        total: employees.length,
        items: employees,
      };
    } catch (error) {
      console.error('createMany failed:', error);

      throw new InternalServerErrorException('Не удалось создать работников');
    }
  }

  async updateEmployee(
    dto: UpdateEmployeeDto,
    profile: IProfile,
  ): Promise<IEmployeeInfo> {
    const { employeeId, profileWorkshopCode } = profile;

    // Получаем сущности
    const employee = await this.employeeService.getEmployee(dto.id);
    const team = await this.teamService.getTeam(dto.teamNumber);
    const profileTeam = await this.teamService.getTeam(dto.profileTeamNumber);

    const hasKlsChanges = this.hasKlsFieldsChanged(employee, dto);
    const hasProfileChanges = this.hasProfileFieldsChanged(employee, dto);

    // Проверяем условия - cотрудник не может редактировать собственные данные
    if ((hasKlsChanges || hasProfileChanges) && employeeId === employee.id) {
      throw new ConflictException('Нельзя редактировать себя');
    }

    const position = await this.getEmployeePosition(
      dto.positionCode,
      dto.scheduleCode,
      dto.gradeCode,
      dto.paymentCode,
    );

    const profilePosition = await this.getEmployeePosition(
      dto.profilePositionCode,
      dto.profileScheduleCode,
      dto.profileGradeCode,
      dto.profilePaymentCode,
    );

    // Проверяем совместимость цеха работника и цеха пользователя
    // Если цехи одинаковые - можно менять все поля, но позиции только своего цеха
    // Если цехи разные - можно менять только profile-поля, можно назначать позиции любых цехов
    const isSameWorkshop =
      profileWorkshopCode === position.workshop.workshopCode;

    // Если разные цехи
    if (!isSameWorkshop) {
      // Если КЛС-поля редактируются
      if (hasKlsChanges) {
        throw new ConflictException('Нельзя менять КЛС');
      }

      // Если profile-поля не менялись - ничего не делаем (ранний возврат)
      if (!hasProfileChanges) {
        return this.getEmployeeInfo(employee.personalNumber);
      }
    } else {
      // Если цехи одинаковые
      // Нельзя редактировать profile-поля другого цеха
      if (profileWorkshopCode !== profilePosition.workshop.workshopCode) {
        throw new ConflictException('Позиция из другого цеха');
      }
    }
    // Если цехи одинаковые или изменились только profile-поля при разных цехах — продолжаем

    // Проверяем соответствие бригады и графика по штатной позиции (КЛС)
    await this.validateTeamScheduleCompatibility(
      dto.teamNumber,
      dto.positionCode,
      dto.gradeCode,
      dto.scheduleCode,
      dto.paymentCode,
    );

    // Проверяем соответствие бригады и графика по штатной позиции (profile-поля)
    await this.validateTeamScheduleCompatibility(
      dto.profileTeamNumber,
      dto.profilePositionCode,
      dto.profileGradeCode,
      dto.profileScheduleCode,
      dto.profilePaymentCode,
    );

    // Проверяем уникальность ФИО
    await this.employeeService.validateUniqueFullNameExcluding(
      employee.id,
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    // Проверяем уникальность личного номера
    await this.employeeService.validateUniquePersonalNumberExcluding(
      employee.id,
      dto.personalNumber,
    );

    // Проверяем уволенного сотрудника и доступ в кабинет
    if (dto.endDate !== null && dto.hasAccess) {
      throw new ConflictException('Отключите доступ в кабинет');
    }

    // Проверяем дату рождения (не может быть в будущем)
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем условие - руководитель в бригаде может быть только один
    if (this.isManagerRole(profilePosition.role.name as ERole)) {
      await this.employeeService.existsTeamManagerExcluding(
        employee.id,
        profileTeam.id,
        profilePosition.workshop.id,
        profilePosition.schedule.id,
        profilePosition.role.id,
      );
    }

    // Обновление полей
    employee.lastName = dto.lastName;
    employee.firstName = dto.firstName;
    employee.patronymic = dto.patronymic;
    employee.personalNumber = dto.personalNumber;
    employee.birthDay = dto.birthDay;
    employee.startDate = dto.startDate;
    employee.endDate = dto.endDate;
    employee.hasAccess = dto.endDate !== null ? false : dto.hasAccess;
    employee.isActive = dto.endDate === null;

    // Обновление связей
    employee.team = team;
    employee.position = position;
    employee.profileTeam = profileTeam;
    employee.profilePosition = profilePosition;

    // Сохранение изменений
    await this.employeeRepository.save(employee);

    // Возврат результата
    return this.getEmployeeInfo(employee.personalNumber);
  }

  async getEmployeeInfo(personalNumber: number): Promise<IEmployeeInfo> {
    const employee =
      await this.employeeService.getEmployeeByPersonalNumber(personalNumber);

    return {
      id: employee.id,

      profileWorkshopCode: employee.profilePosition.workshop.workshopCode,
      profileTeamNumber: employee.profileTeam.teamNumber,
      profilePositionCode: employee.profilePosition.positionCode,
      profileGradeCode: employee.profilePosition.grade.gradeCode,
      profileScheduleCode: employee.profilePosition.schedule.scheduleCode,
      profilePaymentCode: employee.profilePosition.paymentSystem.paymentCode,
      profileProfessionName: employee.profilePosition.profession.name,
      profileRoleName: employee.profilePosition.role.name,

      hasAccess: employee.hasAccess,

      lastName: employee.lastName,
      firstName: employee.firstName,
      patronymic: employee.patronymic,
      professionName: employee.position.profession.name,

      workshopCode: employee.position.workshop.workshopCode,
      teamNumber: employee.team.teamNumber,
      personalNumber: employee.personalNumber,
      positionCode: employee.position.positionCode,
      gradeCode: employee.position.grade.gradeCode,
      scheduleCode: employee.position.schedule.scheduleCode,
      paymentCode: employee.position.paymentSystem.paymentCode,

      birthDay: employee.birthDay,
      startDate: employee.startDate,
      endDate: employee.endDate ?? null,
      isActive: employee.isActive,
    };
  }

  async getEmployeesForSchedule(
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

  private async getEmployeePosition(
    positionCode: number,
    scheduleCode: string,
    gradeCode: number,
    paymentCode: string,
  ): Promise<Position> {
    const schedule = await this.scheduleService.getScheduleByCode(scheduleCode);

    const grade = await this.gradeService.getGrade(gradeCode);

    const paymentSystem =
      await this.paymentSystemService.getPaymentSystem(paymentCode);

    const position = await this.positionService.getPosition(
      positionCode,
      grade.id,
      schedule.id,
      paymentSystem.id,
    );

    return position;
  }

  private hasKlsFieldsChanged(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): boolean {
    return (
      employee.lastName !== dto.lastName ||
      employee.firstName !== dto.firstName ||
      employee.patronymic !== dto.patronymic ||
      employee.personalNumber !== dto.personalNumber ||
      employee.team.teamNumber !== dto.teamNumber ||
      employee.position.positionCode !== dto.positionCode ||
      employee.position.grade.gradeCode !== dto.gradeCode ||
      employee.position.schedule.scheduleCode !== dto.scheduleCode ||
      employee.position.paymentSystem.paymentCode !== dto.paymentCode ||
      toDateString(employee.birthDay) !== toDateString(dto.birthDay) ||
      toDateString(employee.startDate) !== toDateString(dto.startDate) ||
      toDateString(employee.endDate) !== toDateString(dto.endDate) ||
      employee.hasAccess !== dto.hasAccess
    );
  }

  private hasProfileFieldsChanged(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): boolean {
    return (
      employee.profileTeam.teamNumber !== dto.profileTeamNumber ||
      employee.profilePosition.positionCode !== dto.profilePositionCode ||
      employee.profilePosition.grade.gradeCode !== dto.profileGradeCode ||
      employee.profilePosition.schedule.scheduleCode !==
        dto.profileScheduleCode ||
      employee.profilePosition.paymentSystem.paymentCode !==
        dto.profilePaymentCode
    );
  }

  private isManagerRole(role: ERole): boolean {
    return [
      ERole.HEAD,
      ERole.LEAD_MASTER,
      ERole.DETAIL_MASTER,
      ERole.MASTER,
    ].includes(role);
  }

  private SCHEDULE_TEAM_RULES: Record<string, number[]> = {
    '2': [1, 2, 3, 4],
    '2-А': [1, 2, 3, 4],
    '5-Б-1': [5],
    '9': [1, 2],
  };

  private async validateTeamScheduleCompatibility(
    teamNumber: number,
    positionCode: number,
    gradeCode: number,
    scheduleCode: string,
    paymentCode: string,
  ): Promise<void> {
    const position = await this.getEmployeePosition(
      positionCode,
      scheduleCode,
      gradeCode,
      paymentCode,
    );

    // Получаем допустимые бригады для графика
    const allowedTeams =
      this.SCHEDULE_TEAM_RULES[position.schedule.scheduleCode];

    // Проверяем, входит ли бригада в список допустимых
    if (!allowedTeams.includes(teamNumber)) {
      throw new ConflictException('Позиция не соответствует бригаде');
    }
  }
}
