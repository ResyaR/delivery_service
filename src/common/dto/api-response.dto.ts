import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: 'Success message' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty({ required: false })
  error?: string;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty({ example: 'Data fetched successfully' })
  message: string;

  @ApiProperty()
  data: T[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
} 