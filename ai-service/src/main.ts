import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { execSync } from 'child_process';

import { ThrottlerGuard } from '@nestjs/throttler'
import * as express from 'express';

async function bootstrap() {
  const port = process.env.AI_SERVICE_PORT || 8000;

  // Kill any existing process on this port before starting
  try {
    if (process.platform === 'win32') {
      try {
        const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = stdout.split(/\r?\n/);
        for (const line of lines) {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              console.log(`Killing process ${pid} on port ${port}`);
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            }
          }
        }
      } catch (e) {}
    } else {
      execSync(`npx kill-port ${port}`, { stdio: 'ignore', timeout: 5000 });
    }
  } catch (e) {}

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  // Increase payload size limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.useGlobalGuards(new ThrottlerGuard(new Reflector()))

  const config = new DocumentBuilder()
    .setTitle('OTRAS AI Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`AI Orchestration Service is running on: http://localhost:${port}`);
  console.log(`API Prefix: /api/v1`);
}
bootstrap();

