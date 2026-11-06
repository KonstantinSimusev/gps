import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaymentSystem } from './entities/payment-system.entity';

@Injectable()
export class PaymentSystemRepository {
  constructor(
    @InjectRepository(PaymentSystem)
    private readonly paymentSystemRepository: Repository<PaymentSystem>,
  ) {}

  async findByCode(paymentCode: string): Promise<PaymentSystem | null> {
    return this.paymentSystemRepository.findOne({
      where: { paymentCode },
    });
  }
}
