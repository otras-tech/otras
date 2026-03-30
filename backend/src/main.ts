import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { AppLogger } from './logger/logger.service';

async function bootstrap() {
  // Robust .env loader
  // ... (keep logic)
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (
          value.length > 0 &&
          value.startsWith("'") &&
          value.endsWith("'")
        ) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }

  const port = process.env.PORT || 4000;
  console.log(`Starting backend on port ${port}...`);

  // Kill port logic
  try {
    if (process.platform === 'win32') {
      try {
        const stdout = execSync(
          `netstat -ano | findstr :${port} | findstr LISTENING`,
        ).toString();
        const pid = stdout.trim().split(/\s+/).pop();
        if (pid && pid !== '0' && pid !== 'LISTENING') {
          console.log(`Killing process ${pid} on port ${port}`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      } catch (e) {}
    }
  } catch (e) {}

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  // Hardened Security Headers
  app.use(helmet());

  // API Performance (Gzip)
  app.use(compression());

  app.enableCors();

  // Apply Global Filters, Pipes and Guards
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  // Use express middleware for large payloads
  const express = require('express');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  try {
    await app.listen(port);
    logger.log(`Backend is running on: http://localhost:${port}`, 'Bootstrap');
  } catch (error) {
    logger.error('Backend failed to start', error.stack, 'Bootstrap');
  }
}
bootstrap();
