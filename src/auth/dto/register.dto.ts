import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username (must be unique)',
    example: 'johndoe123',
    required: true,
    uniqueItems: true,
    minLength: 4,
    pattern: '^[a-zA-Z0-9_]+$'
  })
  @IsString()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscore'
  })
  username: string;

  @ApiProperty({
    description: 'Password',
    example: 'StrongP@ss123'
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password harus memiliki minimal 8 karakter, huruf besar, huruf kecil, angka, dan karakter spesial'
    }
  )
  password: string;
}
