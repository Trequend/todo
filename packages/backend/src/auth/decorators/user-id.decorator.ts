import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request: FastifyRequest = context.switchToHttp().getRequest();
  return request.session.userId;
});
