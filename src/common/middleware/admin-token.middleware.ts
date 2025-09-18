import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token || token !== 'Bearer resya123@') {
      throw new UnauthorizedException('Invalid admin token');
    }

    next();
  }
}