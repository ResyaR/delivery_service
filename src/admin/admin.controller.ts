import { Controller, Delete, Headers, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UserService } from '../users/user.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Delete('users')
  @ApiOperation({ summary: 'Delete all users (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'All users deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid admin key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async deleteAllUsers(@Headers('admin-key') adminKey: string) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      await this.userService.deleteAllUsers();
      return { message: 'All users deleted successfully' };
    } catch (error) {
      console.error('Error deleting users:', error);
      throw new InternalServerErrorException('Failed to delete users: ' + error.message);
    }
  }
}