import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Files = createParamDecorator<void>(
  async (_, context: ExecutionContext) => {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    if (request.multipartFiles) {
      return request.multipartFiles;
    } else {
      throw new Error('No files uploads interceptor');
    }
  }
);
