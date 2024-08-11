import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { PapertrailLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Settings Api')
    .setDescription('Api for basic settings')
    .setVersion('1.0')
    .addTag('settings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const papertrailLogger = app.get(PapertrailLogger);
  app.useLogger(papertrailLogger);

  app.enableCors();
  await app.listen(4000);
}
bootstrap();
