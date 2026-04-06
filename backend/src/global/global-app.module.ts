import { Module, Global } from '@nestjs/common';

import { AuthModule } from '../modules/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  exports: [AuthModule],
})
export class GlobalAppModule {}
