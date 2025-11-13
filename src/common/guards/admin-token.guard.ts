import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminKey = request.headers['admin-key'];

    if (!adminKey || adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}

