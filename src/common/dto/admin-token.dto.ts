import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class AdminTokenDto {
  @ApiProperty({
    description: 'Token admin untuk akses fitur khusus',
    example: 'resya123@'
  })
  @IsString()
  @Matches(/^resya123@$/, {
    message: 'Token admin tidak valid. Token yang benar adalah: resya123@'
  })
  adminToken: string;
}