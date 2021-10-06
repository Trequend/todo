import { Module } from '@nestjs/common';
import { WatchModelModule } from 'src/watch-model/watch-model.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserFilterService } from './services/user-filter.service';

@Module({
  imports: [
    WatchModelModule.register({
      name: User.name,
      schema: UserSchema,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserFilterService],
  exports: [UsersService],
})
export class UsersModule {}
