
import { 
  Controller, 
  UseGuards, 
  Put, 
  Body, 
  Request, 
  Post,
  Get,
  Delete,
  Param,
  Res,
  UploadedFile, 
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminTokenDto } from '../common/dto/admin-token.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('admin/all')
  @ApiOperation({ summary: 'Get all users with their activity information (Requires admin token)' })
  @ApiBody({ type: AdminTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all users with their activity information',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          fullName: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          lastLogin: { type: 'string', format: 'date-time' },
          lastLogout: { type: 'string', format: 'date-time' },
          lastRequestRefreshToken: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid admin token' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid token format' })
  async getAllUsers(@Body() adminTokenDto: AdminTokenDto) {
    const users = await this.userService.findAll();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      lastLogout: user.lastLogout,
      lastRequestRefreshToken: user.lastRequestRefreshToken
    }));
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiBody({ type: () => DeleteUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'User berhasil dihapus.',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string',
          example: 'User berhasil dihapus'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST,
    description: 'Kata kunci konfirmasi tidak valid.',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string',
          example: 'Kata kunci tidak valid. Kata kunci yang benar adalah: "resya 123"'
        },
        error: {
          type: 'string',
          example: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'User tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string',
          example: 'User tidak ditemukan'
        },
        error: {
          type: 'string',
          example: 'Not Found'
        }
      }
    }
  })
  async deleteUser(
    @Request() req,
    @Body() deleteUserDto: DeleteUserDto
  ) {
    try {
      await this.userService.deleteUser(req.user.id);
      return {
        message: 'User berhasil dihapus'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal menghapus user');
    }
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
      // Generate unique filename
      const fileName = `avatar-${req.user.id}-${Date.now()}.${file.originalname.split('.').pop()}`;
      
      // Save file to public directory (this is just an example, in production you might want to use cloud storage)
      const filePath = `/uploads/avatars/${fileName}`;
      await this.saveFile(file.buffer, filePath);

      // Update avatar URL in database
      const updated = await this.userService.updateProfile(req.user.id, {
        avatar: `${process.env.APP_URL}${filePath}`
      });

      if (!updated) {
        throw new InternalServerErrorException('Gagal menyimpan avatar');
      }

      return {
        message: 'Avatar updated successfully',
        data: {
          id: updated.id,
          email: updated.email,
          avatarUrl: updated.avatar
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menyimpan avatar');
    }
  }

  private async saveFile(buffer: Buffer, filePath: string): Promise<void> {
    // This is a simplified example. In production, use proper file storage service
    const fs = require('fs');
    const path = require('path');
    
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const directory = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Save file
    await fs.promises.writeFile(fullPath, buffer);
  }
}
