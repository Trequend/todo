import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request: FastifyRequest & { headers: { [Key in string]: string } } =
      context.switchToHttp().getRequest();

    if (request.session.xsrfToken) {
      const token = request.headers['x-xsrf-token'];
      if (token !== request.session.xsrfToken) {
        throw new BadRequestException('Wrong header: X-XSRF-TOKEN');
      }
    }

    return next.handle().pipe(
      tap(() => {
        const response: FastifyReply = context.switchToHttp().getResponse();
        if (!request.session) {
          return;
        }

        if (request.session.xsrfToken) {
          response.setCookie('XSRF-TOKEN', request.session.xsrfToken, {
            sameSite: 'strict',
            path: '/',
            expires: new Date(
              Date.now() +
                (process.env.SESSION_MAX_AGE
                  ? Number.parseInt(process.env.SESSION_MAX_AGE)
                  : 24 * 60 * 60 * 1000) // ONE DAY
            ),
          });
        }
      })
    );
  }
}
