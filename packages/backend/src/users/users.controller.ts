import {
  Body,
  Controller,
  Delete,
  Get,
  MessageEvent,
  Post,
  Put,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { WatchModelService } from 'src/watch-model/watch-model.service';
import { UserId } from '../auth/decorators/user-id.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { FilteredUser } from './types/filtered-user';
import { UsersService } from './services/users.service';
import { Types } from 'mongoose';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserDto } from './dto/change-user.dto';
import { File } from 'src/uploads/decorators/file.decorator';
import { MultipartFile } from 'fastify-multipart';
import { UserFilterService } from './services/user-filter.service';
import { UseFilesUploads } from 'src/uploads/decorators/use-files-uploads.decorator';
import { DisableAuth } from 'src/auth/decorators/disable-auth.decorator';

@Auth()
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userFilterService: UserFilterService,
    private readonly watchModelService: WatchModelService<User>
  ) {}

  @Get()
  async getUser(@UserId() userId: string): Promise<FilteredUser> {
    const user = await this.usersService.getById(userId);
    return this.userFilterService.filterUser(user);
  }

  @Post()
  @DisableAuth()
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<FilteredUser & { id: string }> {
    const user = await this.usersService.createUser(createUserDto);
    const id = user._id.toString();
    return {
      id,
      ...this.userFilterService.filterUser(user),
    };
  }

  @Put()
  async changeUser(
    @UserId() userId: string,
    @Body() changeUserDto: ChangeUserDto
  ) {
    return this.userFilterService.filterUser(
      await this.usersService.changeUser(userId, changeUserDto)
    );
  }

  @Put('avatar')
  @UseFilesUploads({
    config: {
      limits: {
        files: 1,
        fileSize: 2 * 1024 * 1024,
      },
    },
    mimetypes: [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ],
  })
  async changeAvatar(@UserId() userId: string, @File() file: MultipartFile) {
    return {
      avatarId: await this.usersService.changeAvatar(userId, file),
    };
  }

  @Delete('avatar')
  async deleteAvatar(@UserId() userId: string) {
    await this.usersService.deleteAvatar(userId);
  }

  @Put('password')
  async changePassword(
    @UserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    await this.usersService.changePassword(userId, changePasswordDto);
  }

  @Sse('sse')
  sse(@UserId() userId: string): Observable<MessageEvent> {
    return this.watchModelService.watch(
      [
        {
          $match: {
            'fullDocument._id': new Types.ObjectId(userId),
          },
        },
      ],
      {
        transform: (user) => {
          return this.userFilterService.filterUser(user);
        },
      }
    );
  }
}
