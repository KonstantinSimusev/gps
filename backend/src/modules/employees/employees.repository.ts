import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async save(employee: Employee): Promise<Employee> {
    return this.employeesRepository.save(employee);
  }

  async findByAccountId(id: string): Promise<Employee> {
    return this.employeesRepository.findOne({
      where: {
        account: { id },
        isActive: true,
      },
      relations: [
        'account',
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.role',
      ],
    });
  }

  async findByWorkshopAndTeam(
    workshopCode: string,
    teamNumber: string,
  ): Promise<Employee[]> {
    return this.employeesRepository.find({
      where: {
        position: { workshop: { workshopCode } },
        team: { teamNumber },
        isActive: true,
      },
      relations: [
        'account',
        'position',
        'team',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.role',
      ],
      // select: {
      //   id: true,
      //   lastName: true,
      //   firstName: true,
      //   patronymic: true,
      //   personalNumber: true,
      //   position: {
      //     positionCode: true,
      //     workshop: {
      //       workshopCode: true
      //     },
      //   },
      //   team: {
      //     teamNumber: true,
      //   },
      // },
    });
  }

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

  // async remove(id: string): Promise<void> {
  //   this.employeesRepository.delete(id);
  // }
}
