import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EventBusTransport } from './eventbus/eventbus.module';
import { AppConfigService } from './config.service';
import { AppExceptionFilter } from './common/app.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = new AppConfigService();

  app.connectMicroservice({ strategy: new EventBusTransport(appConfig.kafka) });

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Accounting Service')
    .setVersion('1.0')
    .addTag('accounting')
    .addServer('/accounting')
    .addApiKey({ type: 'apiKey', name: 'authorization' }, 'authorization')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
