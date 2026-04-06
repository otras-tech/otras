"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
if (!globalThis.crypto) {
    try {
        globalThis.crypto = require('node:crypto').webcrypto;
    }
    catch (e) {
        console.error('Critical: globalThis.crypto is not available. Please upgrade to Node.js 18.15+ or 20+.');
    }
}
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nestjs_pino_1 = require("nestjs-pino");
const common_1 = require("@nestjs/common");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("@nestjs/config");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    logger.log('🚀 Nest application bootstrapping...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: false,
        bodyParser: true,
    });
    const configService = app.get(config_1.ConfigService);
    const pinoLogger = app.get(nestjs_pino_1.Logger);
    app.useLogger(pinoLogger);
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.setGlobalPrefix('api/v1');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    const allowedOrigins = configService.get('allowedOrigins') || ['*'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);
            if (isAllowed) {
                callback(null, true);
            }
            else {
                logger.warn(`[CORS] Request blocked from unauthorized origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Accept',
            'Authorization',
            'x-idempotency-key',
            'x-request-id',
        ],
        exposedHeaders: ['x-request-id'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const showSwagger = configService.get('SHOW_SWAGGER') === 'true';
    if (configService.get('NODE_ENV') !== 'production' || showSwagger) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Otras API')
            .setDescription('Production-grade scalable backend APIs')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    const port = configService.get('PORT') || 4000;
    try {
        await app.listen(port, '0.0.0.0');
        logger.log(`🚀 Backend is running on: http://localhost:${port}/api/v1`);
        logger.log(`📄 API Documentation: http://localhost:${port}/api/docs`);
    }
    catch (error) {
        logger.error('Backend failed to start', error instanceof Error ? error.stack : error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map