import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { FilteredUser } from '../types/filtered-user';

@Injectable()
export class UserFilterService {
  filterUser(user: User): FilteredUser {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarId: user.avatarId ?? null,
    };
  }
}
