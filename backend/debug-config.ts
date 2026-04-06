import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  
  const accessSecret = config.get('jwt.accessSecret');
  const refreshSecret = config.get('jwt.refreshSecret');
  
  console.log('--- CONFIG DEBUG ---');
  console.log(`Access Secret Key Present: ${!!accessSecret}`);
  if (accessSecret) {
    console.log(`Access Secret Length: ${accessSecret.length}`);
    console.log(`Access Secret (Trimmed) Length: ${accessSecret.trim().length}`);
  }
  console.log(`Refresh Secret Key Present: ${!!refreshSecret}`);
  console.log('--------------------');
  
  await app.close();
}
bootstrap();
