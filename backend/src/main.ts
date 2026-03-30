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
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);


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

  // ✅ Swagger Documentation (Disabled in production)
  if (configService.get('NODE_ENV') !== 'production') {
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
  const logger = new Logger('Bootstrap');
  try {
    await app.listen(port);
    logger.log(`Backend is running on: http://localhost:${port}/api/docs`);
  } catch (error) {
    logger.error("Backend failed to start", error instanceof Error ? error.stack : error);
  }
}
bootstrap();
