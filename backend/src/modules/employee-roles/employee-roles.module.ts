import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';
import { EmployeeRolesRepository } from './employee-roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRole])],
  controllers: [],
  providers: [EmployeeRolesRepository],
  exports: [EmployeeRolesRepository],
})
export class EmployeeRolesModule {}
