import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ShippingManagerService } from '../../shipping-managers/shipping-manager.service';

@Injectable()
export class ShippingManagerTokenGuard implements CanActivate {
  constructor(private shippingManagerService: ShippingManagerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['shipping-manager-token'] || request.body?.token;

    if (!token) {
      throw new UnauthorizedException('Shipping manager token is required');
    }

    try {
      const manager = await this.shippingManagerService.findByToken(token);
      // Attach manager to request for use in controllers
      request.shippingManager = manager;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }
}

