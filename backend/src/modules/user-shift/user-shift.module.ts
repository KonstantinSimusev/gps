import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserShift } from './entities/user-shift.entity';

import { UserShiftRepository } from './user-shift.repository';
import { UserShiftService } from './user-shift.service';
import { UserShiftController } from './user-shift.controller';

import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ShiftModule } from '../shift/shift.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserShift]),
    UserModule,
    AuthModule,
    forwardRef(() => ShiftModule),
  ],
  controllers: [UserShiftController],
  providers: [UserShiftRepository, UserShiftService],
  exports: [UserShiftRepository, UserShiftService],
})
export class UserShiftModule {}
