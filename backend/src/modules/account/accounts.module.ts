import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';
import { EmployeesModule } from '../employees/employees.module';
import { AccountsController } from './accounts.controller';
import { WorkshopsModule } from '../workshops/workshops.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    WorkshopsModule,
    forwardRef(() => EmployeesModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsRepository, AccountsService],
  exports: [AccountsRepository, AccountsService],
})
export class AccountsModule {}
