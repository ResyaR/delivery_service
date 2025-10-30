import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvalidatedToken } from './entities/invalidated-token.entity';
import { OtpVerification } from './entities/otp-verification.entity';
import { EmailService } from './email.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([OtpVerification, InvalidatedToken, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    AuthService, 
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService, userService: UserService, authService: AuthService) => {
        return new JwtStrategy(configService, userService, authService);
      },
      inject: [ConfigService, UserService, AuthService],
    },
    EmailService
  ],
  controllers: [AuthController],
  exports: [EmailService],
})
export class AuthModule {}
