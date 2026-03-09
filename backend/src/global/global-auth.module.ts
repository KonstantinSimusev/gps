import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';

@Global() // ← делает модуль глобальным
@Module({
  imports: [AuthModule], // ← импортируем AuthModule
  exports: [AuthModule], // ← экспортируем его глобально
})
export class GlobalAuthModule {}
