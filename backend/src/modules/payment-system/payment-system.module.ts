import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentSystem } from './entities/payment-system.entity';
import { PaymentSystemRepository } from './payment-system.repository';
import { PaymentSystemService } from './payment-system.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSystem])],
  controllers: [],
  providers: [PaymentSystemRepository, PaymentSystemService],
  exports: [PaymentSystemService],
})
export class PaymentSystemModule {}
