import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CsrfInterceptor } from './auth/interceptors/csrf.interceptor';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config, configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        uri: configService.get('mongoUrl'),
        dbName: configService.get('mongoDBName'),
      }),
      inject: [ConfigService],
    }),
    UploadsModule,
    UsersModule,
    AuthModule,
    TodosModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfInterceptor,
    },
  ],
})
export class AppModule {}
