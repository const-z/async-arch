import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setVersion('1.0')
    .addTag('auth')
    .addServer('/auth')
    .addApiKey({ type: 'apiKey', name: 'authorization' }, 'authorization')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
