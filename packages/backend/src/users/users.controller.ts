import { Body, Controller, Get, MessageEvent, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { WatchModelService } from 'src/watch-model/watch-model.service';
import { UserId } from '../auth/decorators/user-id.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { FilteredUser } from './types/filtered-user';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly watchModelService: WatchModelService<User>
  ) {}

  @Get()
  @Auth()
  async getUser(@UserId() userId: string): Promise<FilteredUser> {
    const user = await this.usersService.getById(userId);
    return this.usersService.filterUser(user);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<FilteredUser & { id: string }> {
    const user = await this.usersService.createUser(createUserDto);
    return {
      id: user._id.toString(),
      ...this.usersService.filterUser(user),
    };
  }

  @Auth()
  @Sse('sse')
  sse(@UserId() userId: string): Observable<MessageEvent> {
    return this.watchModelService.stream(userId, (user) => {
      return this.usersService.filterUser(user);
    });
  }
}
