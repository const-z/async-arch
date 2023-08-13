import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EventBusTransport } from './eventbus/eventbus.module';
import { AppConfigService } from './config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = new AppConfigService();

  app.connectMicroservice({ strategy: new EventBusTransport(appConfig.kafka) });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setVersion('1.0')
    .addTag('auth')
    .addServer('/auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
