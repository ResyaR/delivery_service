import { IsString, IsEmail, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateShippingManagerDto {
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
}

