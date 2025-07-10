import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, description: 'Nama lengkap user' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, description: 'Nomor telepon user (format Indonesia)' })
  @IsOptional()
  @IsPhoneNumber('ID')
  phone?: string;
}
