import { NestMiddleware } from '@nestjs/common';
export declare class LanguageMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
