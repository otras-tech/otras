import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Robust .env loader
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }

  const port = process.env.PORT || 4000;
  
  // Kill port logic
  try {
    if (process.platform === 'win32') {
      try {
        const stdout = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`).toString();
        const pid = stdout.trim().split(/\s+/).pop();
        if (pid && pid !== '0' && pid !== 'LISTENING') {
          console.log(`Killing process ${pid} on port ${port}`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      } catch (e) { }
    }
  } catch (e) { }

  // ...
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // ✅ Optimized: Express middleware for large payloads
  // Set these BEFORE Swagger and other middleware
  const express = require('express');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // ✅ Added Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Otras API')
    .setDescription('Production-grade scalable backend APIs for 1M+ users')
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

  try {
    await app.listen(port);
    console.log(`Backend is running on: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error("Backend failed to start:", error);
  }
}
bootstrap();
