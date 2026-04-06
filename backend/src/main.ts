// ✅ Ensure early environment variables loading for robust bootstrap
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

// ✅ Ensure global crypto is available (Required for NestJS 11 and @nestjs/schedule)
if (!globalThis.crypto) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.crypto = require('node:crypto').webcrypto;
  } catch (e) {
    console.error('Critical: globalThis.crypto is not available. Please upgrade to Node.js 18.15+ or 20+.');
  }
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ValidationPipe, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('🚀 Nest application bootstrapping...');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
    bodyParser: true,
  });

  const configService = app.get(ConfigService);

  const pinoLogger = app.get(PinoLogger);
  app.useLogger(pinoLogger);


  // ✅ Production: Trust Proxy for load balancers
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // ✅ Production-Grade Security Chain
  app.setGlobalPrefix('api/v1');

  // ✅ Production-Grade Security Headers (Uniform Application)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Essential for Swagger/cross-domain asset compatibility
    }),
  );


  // ✅ Production-Grade Robust CORS (Restricted to Allowlist)
  const allowedOrigins = configService.get<string[]>('allowedOrigins') || ['*'];
  
  app.enableCors({
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
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

  // ✅ Production-Grade Utilities
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Standard body limits handled via NestFactory configuration during creation

  // ✅ Swagger Documentation (Enabled if not production OR SHOW_SWAGGER=true)
  const showSwagger = configService.get('SHOW_SWAGGER') === 'true';

  if (configService.get('NODE_ENV') !== 'production' || showSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Otras API')
      .setDescription('Production-grade scalable backend APIs')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

  }

  const port = configService.get<number>('PORT') || 4000;

  try {
    await app.listen(port, '0.0.0.0');


    logger.log(`🚀 Backend is running on: http://localhost:${port}/api/v1`);
    logger.log(`📄 API Documentation: http://localhost:${port}/api/docs`);
  } catch (error) {
    logger.error(
      'Backend failed to start',
      error instanceof Error ? error.stack : error,
    );
  }
}
bootstrap();
