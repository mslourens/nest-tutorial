import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExcludeNullInterceptor } from './utils/excludeNull.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ExcludeNullInterceptor());
  await app.listen(config.get('PORT'));
}
bootstrap();
