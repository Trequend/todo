import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async getLoginData({
    email,
    password,
  }: LoginDto): Promise<{ id: string; xsrfToken: string }> {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    if (!this.usersService.isValidPassword(password, user.passwordHash)) {
      throw new BadRequestException('Wrong login or password');
    }

    const xsrfToken = crypto.randomBytes(64).toString('base64url');
    return {
      id: user._id.toString(),
      xsrfToken,
    };
  }
}
