import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CacheService } from './src/common/cache/cache.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cacheService = app.get(CacheService);
  
  console.log('--- REDIS KEYS AUDIT ---');
  // This is a bit tricky with CacheManager, but we can try to get some known keys
  const keys = [
    'subjects_all',
    'exams_all_null',
    'categories_all',
    'applications_all'
  ];

  for (const key of keys) {
    const val = await cacheService.get(key);
    console.log(`${key}: ${val ? 'EXISTS (cached)' : 'MISSING'}`);
  }

  await app.close();
}

bootstrap();
