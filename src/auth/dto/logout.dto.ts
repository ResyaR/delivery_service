import { ApiProperty } from '@nestjs/swagger';

export class LogoutSuccessDto {
  @ApiProperty({ example: 'Logout success' })
  message: string;
}

export class LogoutErrorDto {
  @ApiProperty({ example: 'Logout failed' })
  message: string;
  
  @ApiProperty({ example: 'User not found or already logged out' })
  error?: string;
} 