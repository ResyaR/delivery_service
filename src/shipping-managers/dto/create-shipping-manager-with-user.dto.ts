import { IsString, IsEmail, IsInt, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShippingManagerWithUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsInt()
  @Min(1)
  @Max(5)
  zone: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}

