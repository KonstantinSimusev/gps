import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';

import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

import { AccountsModule } from '../account/accounts.module';
import { PositionsModule } from '../positions/positions.module';
import { TeamsModule } from '../teams/teams.module';
import { RolesModule } from '../roles/roles.module';
import { EmployeeRolesModule } from '../employee-roles/employee-roles.module';
import { WorkshopsModule } from '../workshops/workshops.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    PositionsModule,
    TeamsModule,
    RolesModule,
    EmployeeRolesModule,
    WorkshopsModule,
    forwardRef(() => AccountsModule),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesRepository, EmployeesService],
  exports: [EmployeesRepository],
})
export class EmployeesModule {}
