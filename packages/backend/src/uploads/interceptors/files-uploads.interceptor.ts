import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PayloadTooLargeException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { FILES_UPLOADS_OPTIONS } from '../constants';
import { FilesUploadsOptions } from '../types/files-uploads-options.type';

@Injectable()
export class FilesUploadsInterceptor implements NestInterceptor {
  private readonly fastify: FastifyInstance;

  constructor(
    private readonly reflector: Reflector,
    adapterHost: HttpAdapterHost
  ) {
    this.fastify = adapterHost.httpAdapter.getInstance();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const options = this.reflector.getAllAndOverride<FilesUploadsOptions>(
      FILES_UPLOADS_OPTIONS,
      [context.getHandler(), context.getClass()]
    ) || { config: {} };

    const files = request.files(options.config);
    request.multipartFiles = (async function* () {
      for await (const file of files) {
        if (options.mimetypes && !options.mimetypes.includes(file.mimetype)) {
          throw new BadRequestException('Wrong mimetype');
        } else {
          yield file;
        }
      }
    })();

    return next.handle().pipe(
      catchError((error) => {
        if (
          error instanceof this.fastify.multipartErrors.RequestFileTooLargeError
        ) {
          return throwError(
            () => new PayloadTooLargeException('File too large')
          );
        }

        return throwError(() => error);
      })
    );
  }
}
