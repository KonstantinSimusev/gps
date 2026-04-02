import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';
import { IEmployeeInfo } from 'src/shared/interfaces/api.interface';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async save(employee: Employee): Promise<Employee> {
    return this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    this.employeesRepository.delete(id);
  }

  async existsByFullName(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<boolean> {
    return this.employeesRepository.exists({
      where: {
        lastName,
        firstName,
        patronymic,
      },
    });
  }

  async existsByPersonalNumber(personalNumber: string): Promise<boolean> {
    return this.employeesRepository.exists({
      where: { personalNumber },
    });
  }

  async findEmployeeByAccount(accountId: string): Promise<{
    employeeId: string;
    workshopCode: string;
    teamNumber: string;
  } | null> {
    return await this.employeesRepository
      .createQueryBuilder('employee')
      .innerJoin('employee.account', 'account') // Связываем сотрудника с аккаунтом
      .where('account.id = :accountId', { accountId }) // Фильтруем по ID аккаунта
      .andWhere('employee.isActive = true') // Учитываем только активных сотрудников
      .select('employee.id', 'employeeId') // Выбираем ID сотрудника
      .innerJoin('employee.team', 'team') // Присоединяем бригаду (Team)
      .addSelect('team.teamNumber', 'teamNumber') // Выбираем номер бригады
      .innerJoin('employee.position', 'position') // Присоединяем позицию (Position) — промежуточное звено
      .innerJoin('position.workshop', 'workshop') // Теперь можем присоединить цех (Workshop) через позицию
      .addSelect('workshop.workshopCode', 'workshopCode') // Выбираем код цеха
      .getRawOne();
  }

  async findEmployeeByPersonalNumber(
    number: string,
  ): Promise<IEmployeeInfo | null> {
    return await this.employeesRepository
      .createQueryBuilder('employee')
      // Основные соединения: данные, гарантированно присутствующие у каждого сотрудника
      .innerJoin('employee.position', 'position')
      .innerJoin('position.workshop', 'workshop')
      .innerJoin('employee.team', 'team')
      // Дополнительные соединения: атрибуты позиции
      .innerJoin('position.profession', 'profession')
      .innerJoin('position.grade', 'grade')
      .innerJoin('position.schedule', 'schedule')
      // Опциональное соединение: роли (может отсутствовать у сотрудника)
      .leftJoin('employee.employeeRoles', 'employeeRole')
      .leftJoin('employeeRole.role', 'role')
      // Выбираем первое поле (обязательно для TypeORM)
      .select('employee.id', 'id')
      // Добавляем остальные поля — каждое на отдельной строке для удобства редактирования
      .addSelect('employee.lastName', 'lastName')
      .addSelect('employee.firstName', 'firstName')
      .addSelect('employee.patronymic', 'patronymic')
      .addSelect('employee.personalNumber', 'personalNumber')
      .addSelect('employee.birthDay', 'birthDay')
      .addSelect('employee.startDate', 'startDate')
      .addSelect('employee.endDate', 'endDate')
      .addSelect('workshop.workshopCode', 'workshop')
      .addSelect('team.teamNumber', 'team')
      .addSelect('profession.name', 'profession')
      .addSelect('position.positionCode', 'positionCode')
      .addSelect('grade.gradeCode', 'grade')
      .addSelect('schedule.scheduleCode', 'schedule')
      .addSelect('role.name', 'role')
      // Условия фильтрации
      .where('employee.personalNumber = :number', { number })
      // .andWhere('employee.isActive = true')
      // Выполняем запрос и возвращаем результат
      .getRawOne();
  }

  // async findByAccount(id: string): Promise<{ id: string } | null> {
  //   return this.employeesRepository.findOne({
  //     where: {
  //       account: { id },
  //       isActive: true,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  // }

  // async findAll(): Promise<Employee[]> {
  //   return this.employeesRepository.find({});
  // }

  // async findById(id: string): Promise<Employee> {
  //   return this.employeesRepository.findOneBy({ id });
  // }

  // async update(employee: Employee, dto: UpdateEmployeeDTO): Promise<Employee> {
  //   return this.employeesRepository.save({
  //     ...employee,
  //     ...dto,
  //   });
  // }
}
