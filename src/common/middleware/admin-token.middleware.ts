import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['admin-token'];

    if (!token || token !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin token');
    }

    next();
  }
}