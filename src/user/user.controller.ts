import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.userService.create(body.username, body.password);
  }

  @Get('find')
  async find(@Query('username') username: string) {
    return this.userService.findByUsername(username);
  }
}
