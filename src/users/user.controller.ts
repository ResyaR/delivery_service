import { Controller, UseGuards, Put, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.id;
    const updated = await this.userService.updateProfile(userId, dto);
    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }
}
