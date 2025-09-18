import { ApiProperty } from '@nestjs/swagger';
import { IsString, Equals } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ 
    description: 'Konfirmasi penghapusan dengan kata kunci: "resya 123"',
    example: 'resya 123'
  })
  @IsString()
  @Equals('resya 123', { 
    message: 'Kata kunci tidak valid. Kata kunci yang benar adalah: "resya 123"'
  })
  confirmationKey: string;
}