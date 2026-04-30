import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [],
  providers: [EmployeeRepository],
  exports: [EmployeeRepository],
})
export class EmployeeModule {}
