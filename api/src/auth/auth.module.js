"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../users/user.module");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./jwt.strategy");
const config_1 = require("@nestjs/config");
const invalidated_token_entity_1 = require("./entities/invalidated-token.entity");
const otp_verification_entity_1 = require("./entities/otp-verification.entity");
const email_service_1 = require("./email.service");
const user_service_1 = require("../users/user.service");
const user_entity_1 = require("../users/user.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UsersModule,
            passport_1.PassportModule,
            typeorm_1.TypeOrmModule.forFeature([otp_verification_entity_1.OtpVerification, invalidated_token_entity_1.InvalidatedToken, user_entity_1.User]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            {
                provide: jwt_strategy_1.JwtStrategy,
                useFactory: (configService, userService, authService) => {
                    return new jwt_strategy_1.JwtStrategy(configService, userService, authService);
                },
                inject: [config_1.ConfigService, user_service_1.UserService, auth_service_1.AuthService],
            },
            email_service_1.EmailService
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [email_service_1.EmailService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map