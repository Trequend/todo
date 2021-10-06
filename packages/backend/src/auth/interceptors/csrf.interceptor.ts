import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService<Config>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (request.session.xsrfToken && request.method !== 'GET') {
      const token = request.headers['x-xsrf-token'];
      if (token !== request.session.xsrfToken) {
        throw new BadRequestException('Wrong header: X-XSRF-TOKEN');
      }
    }

    return next.handle().pipe(
      tap(() => {
        const response: FastifyReply = context.switchToHttp().getResponse();
        if (request.session && request.session.xsrfToken) {
          response.setCookie('XSRF-TOKEN', request.session.xsrfToken, {
            sameSite: 'strict',
            path: '/',
            secure: this.configService.get('isHttpsConnection'),
            expires: new Date(
              Date.now() + this.configService.get('sessionMaxAge')
            ),
          });
        }
      })
    );
  }
}
