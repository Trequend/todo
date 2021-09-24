import { Module } from '@nestjs/common';
import { WatchModelModule } from 'src/watch-model/watch-model.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    WatchModelModule.register({
      name: User.name,
      schema: UserSchema,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
