import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pack } from './entities/pack.entity';

import { PackRepository } from './pack.repository';
import { PackService } from './pack.service';
import { PackController } from './pack.controller';

import { AuthModule } from '../auth/auth.module';
import { ShiftModule } from '../shift/shift.module';
import { ResidueModule } from '../residue/residue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack]),
    AuthModule,
    ResidueModule,
    forwardRef(() => ShiftModule),
  ],
  controllers: [PackController],
  providers: [PackRepository, PackService],
  exports: [PackService],
})
export class PackModule {}
