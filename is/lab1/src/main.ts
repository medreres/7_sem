// eslint-disable-next-line import/no-extraneous-dependencies, simple-import-sort/imports -- // TODO rework to use nest config
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { appConfig } from './modules/config/app.js';
import { createClassValidatorPipe } from './modules/common/pipes/validation.pipe.js';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter.js';
import { AnyExceptionFilter } from './modules/common/filters/any-exception.filter.js';

import './sentry/instrument.js';

const logger = new Logger(AppModule.name);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(createClassValidatorPipe());

  app.useGlobalFilters(new AnyExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  if (!appConfig.isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Hispec')
      .setDescription('The Hispec API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appConfig.port);

  logger.debug(`App is running on port ${appConfig.port}`);
}

void bootstrap();
