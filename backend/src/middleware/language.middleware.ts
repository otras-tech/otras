import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {

    use(req: any, res: any, next: () => void) {

        const language =
            req.headers["x-language"] ||
            req.query.lang ||
            "en";

        req.language = language;

        next();

    }

}