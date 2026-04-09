import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';
import { EmployeesRepository } from './employees.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [],
  providers: [EmployeesRepository],
  exports: [EmployeesRepository],
})
export class EmployeesModule {}
