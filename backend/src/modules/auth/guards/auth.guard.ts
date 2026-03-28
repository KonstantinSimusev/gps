import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const profile = await this.authService.checkAccessToken(
        request,
        response,
      );
      
      request.profile = profile;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Требуется авторизация');
    }
  }
}
