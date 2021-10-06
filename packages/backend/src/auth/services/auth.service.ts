import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import crypto from 'crypto';

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

    const isValidPassword = await this.usersService.isValidPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new BadRequestException('Wrong login or password');
    }

    const xsrfToken = crypto.randomBytes(64).toString('base64url');
    return {
      id: user._id.toString(),
      xsrfToken,
    };
  }
}
