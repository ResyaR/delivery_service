import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address that was used for registration',
    example: 'user@example.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456'
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}