import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';
import { EmployeeRoleRepository } from './employee-role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRole])],
  controllers: [],
  providers: [EmployeeRoleRepository],
  exports: [EmployeeRoleRepository],
})
export class EmployeeRoleModule {}
