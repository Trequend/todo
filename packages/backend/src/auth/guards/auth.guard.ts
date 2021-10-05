import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { AUTH_DISABLED } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const authDisabled = this.reflector.get<boolean>(
      AUTH_DISABLED,
      context.getHandler()
    );

    if (request.session.userId || authDisabled) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
