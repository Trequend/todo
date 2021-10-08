import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@fastify/session';
import fastifyMultipart from 'fastify-multipart';
import MongoStore from 'connect-mongo';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService) as ConfigService<Config>;

  app.register(fastifyMultipart);

  app.register(fastifyCookie);

  app.register(fastifySession, {
    secret: configService.get('sessionSecret'),
    cookieName: 'SESSION-ID',
    cookie: {
      sameSite: 'strict',
      maxAge: configService.get('sessionMaxAge'),
      secure: configService.get('isHttpsConnection'),
    },
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: configService.get('mongoUrl'),
      dbName: configService.get('mongoDBName'),
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true,
    })
  );

  await app.listen(configService.get('port'), '0.0.0.0');
}

bootstrap();
