import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ShippingManagerService } from '../../shipping-managers/shipping-manager.service';
export declare class ShippingManagerTokenGuard implements CanActivate {
    private shippingManagerService;
    constructor(shippingManagerService: ShippingManagerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
