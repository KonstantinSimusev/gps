import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      // 1. Проверяем access-токен (включая возможность его обновления)
      await this.authService.checkAccessToken(request, response);

      // Если метод не выбросил исключение — токен валиден или успешно обновлён
      return true;
    } catch (error) {
      // 2. Если проверка/обновление токена не удалось, обнуляем refresh-токен
      try {
        await this.authService.invalidateRefreshToken(request);
      } catch (invalidateError) {
        console.error('Ошибка при обнулении refresh-токена:', invalidateError);
      }

      // 3. Пробрасываем оригинальное исключение
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
