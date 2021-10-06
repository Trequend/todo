import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, CsrfInterceptor],
  exports: [AuthGuard, CsrfInterceptor],
})
export class AuthModule {}
