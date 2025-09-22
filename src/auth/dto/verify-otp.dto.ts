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
    description: '4-digit OTP code',
    example: '1234'
  })
  @IsString()
  @Length(4, 4)
  otp: string;
}