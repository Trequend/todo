import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@fastify/session';
import fastifyMultipart from 'fastify-multipart';
import MongoStore from 'connect-mongo';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.register(fastifyMultipart);

  app.register(fastifyCookie);

  app.register(fastifySession, {
    secret:
      'DEV-SECRET:fdaguhiclkjasfbwqidinasjbcnizxncgauycgqucwancahsgyabgudnwudzhsgcfsafkaklsuysagbuycngwc',
    cookieName: 'SESSION-ID',
    cookie: {
      sameSite: 'strict',
      maxAge: process.env.SESSION_MAX_AGE
        ? Number.parseInt(process.env.SESSION_MAX_AGE)
        : 24 * 60 * 60 * 1000, // ONE DAY
      secure: false,
    },
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/nest',
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true,
    })
  );

  await app.listen(8000);
}

bootstrap();
