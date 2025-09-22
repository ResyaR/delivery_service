import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    private authService;
    constructor(configService: ConfigService, userService: UserService, authService: AuthService);
    validate(req: Request, payload: any): Promise<import("../users/user.entity").User>;
}
export {};
