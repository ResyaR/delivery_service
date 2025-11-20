import { IsString, IsEmail, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class UpdateShippingManagerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  zone?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  token?: string;
}

