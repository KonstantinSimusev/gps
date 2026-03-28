import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';

import { EmployeeRolesRepository } from './employee-roles.repository';
import { EmployeeRolesService } from './employee-roles.service';
import { EmployeeRolesController } from './employee-roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRole])],
  controllers: [EmployeeRolesController],
  providers: [EmployeeRolesRepository, EmployeeRolesService],
  exports: [EmployeeRolesRepository, EmployeeRolesService],
})
export class EmployeeRolesModule {}
