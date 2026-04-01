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
    bufferLogs: false, // ✅ Set to false to see logs immediately during startup
  });
  const configService = app.get(ConfigService);
  logger.log('✅ AppModule initialized');

  // ✅ Production: Trust Proxy for load balancers
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // ✅ Production: Security Headers
  app.use(helmet());

  const pinoLogger = app.get(PinoLogger);
  app.useLogger(pinoLogger);
  app.setGlobalPrefix('api/v1');

  // ✅ Production: Restricted CORS
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

  app.enableCors({
    origin: allowedOrigins ? allowedOrigins.split(',') : false, // no wildcard in prod
    credentials: true,
  });

  // ✅ Production: Global Validation Pipe (Strict)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true, // Fail if unknown properties are sent
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Production: Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ✅ Production: Global Transformation Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // ✅ Optimized: Express middleware for large payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
      swaggerOptions: { persistAuthorization: true },
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
