import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const File = createParamDecorator<void>(
  async (_, context: ExecutionContext) => {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    if (request.multipartFiles) {
      for await (const file of request.multipartFiles) {
        return file;
      }
    } else {
      throw new Error('No files uploads interceptor');
    }
  }
);
