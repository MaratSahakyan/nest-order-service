import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('API_PORT') || 4000;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    console.log(`App started on port: ${port}`);
  });
}
bootstrap();
