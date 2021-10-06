import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TodosModule } from 'src/todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CsrfInterceptor } from 'src/auth/interceptors/csrf.interceptor';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
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
