import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentSystem } from './entities/payment-system.entity';
import { PaymentSystemRepository } from './payment-system.repository';

@Injectable()
export class PaymentSystemService {
  constructor(
    private readonly paymentSystemRepository: PaymentSystemRepository,
  ) {}

  async getPaymentSystem(paymentCode: string): Promise<PaymentSystem> {
    const paymentSystem =
      await this.paymentSystemRepository.findByCode(paymentCode);

    if (!paymentSystem) {
      throw new NotFoundException(
        `Система оплаты ${paymentCode} не найдена в базе данных`,
      );
    }

    return paymentSystem;
  }
}
