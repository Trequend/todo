import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { FastifyRequest } from 'fastify';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Request() request: FastifyRequest,
    @Body() loginDto: LoginDto
  ): Promise<{ id: string }> {
    if (request.session.userId) {
      throw new BadRequestException('Already logged in');
    }

    const { id, xsrfToken } = await this.authService.getLoginData(loginDto);
    request.session.userId = id;
    request.session.xsrfToken = xsrfToken;
    return { id };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Request() request: FastifyRequest): Promise<void> {
    return await new Promise((resolve, reject) => {
      request.destroySession((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
