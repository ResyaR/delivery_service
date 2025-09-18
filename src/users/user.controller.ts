
import { 
  Controller, 
  UseGuards, 
  Put, 
  Body, 
  Request, 
  Post,
  Get,
  Param,
  Res,
  UploadedFile, 
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/avatar/:id')
  @ApiOperation({ summary: 'Get user avatar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Avatar retrieved successfully.',
    content: {
      'image/*': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Avatar not found.' })
  async getAvatar(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.findById(id);
    
    if (!user || !user.avatar) {
      throw new NotFoundException('Avatar not found');
    }

    res.set({
      'Content-Type': 'image/jpeg', // Sesuaikan dengan tipe file yang disimpan
      'Content-Length': user.avatar.length,
    });

    res.end(user.avatar);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile (nama, phone)' })
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

  @Post('profile/avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' }
      },
      required: ['avatar']
    }
  })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully.' })
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
    status: 400,
    description: 'Bad request. File terlalu besar atau format tidak valid.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'File terlalu besar atau format tidak valid' },
            error: { type: 'string', example: 'Bad Request' },
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
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    })
  )
  async updateAvatar(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    try {
      // Update avatar di database sebagai BLOB
      const updated = await this.userService.updateProfile(req.user.id, {
        avatar: file.buffer
      });

      if (!updated) {
        throw new InternalServerErrorException('Gagal menyimpan avatar');
      }

      return {
        message: 'Avatar updated successfully',
        data: {
          id: updated.id,
          email: updated.email,
          avatarSize: file.size,
          mimeType: file.mimetype
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menyimpan avatar');
    }
  }
}
