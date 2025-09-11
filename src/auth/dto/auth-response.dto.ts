import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'Login success' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ example: 2592000 })
  refresh_token_expires_in: number;

  @ApiProperty({ example: 1200 })
  expires_in: number;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@email.com'
    }
  })
  user: {
    id: number;
    email: string;
  };
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'User registered successfully' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@email.com'
    }
  })
  user: {
    id: number;
    email: string;
  };
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'Token refreshed successfully' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 1200 })
  expires_in: number;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@email.com'
    }
  })
  user: {
    id: number;
    email: string;
  };
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'Profile fetched successfully' })
  message: string;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: 'Budi Santoso', required: false })
  fullName?: string;

  @ApiProperty({ example: '+628123456789', required: false })
  phone?: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', required: false })
  avatar?: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logout success' })
  message: string;
} 