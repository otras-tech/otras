import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['x-language'] as string | undefined;
    (req as Request & { language?: string }).language = lang || 'en';
    next();
  }
}
