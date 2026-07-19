import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [],
  providers: [EmployeeRepository, EmployeeService],
  exports: [EmployeeRepository, EmployeeService],
})
export class EmployeeModule {}
