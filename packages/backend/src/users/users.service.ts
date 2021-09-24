import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilteredUser } from './types/filtered-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getById(id: string): Promise<User | undefined> {
    const user = await this.userModel
      .findById(id, {
        _id: 0,
        email: 1,
        firstName: 1,
        lastName: 1,
        passwordHash: 1,
      })
      .exec();

    return user;
  }

  async getByEmail(
    email: string
  ): Promise<(User & { _id: string }) | undefined> {
    const user = await this.userModel
      .findOne(
        {
          email,
        },
        { email: 1, firstName: 1, lastName: 1, passwordHash: 1 }
      )
      .exec();

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    if (await this.userModel.findOne({ email }, { email: 1 }).exec()) {
      throw new BadRequestException(
        `User with email "${email}" already exists`
      );
    }

    const user = new this.userModel({
      ...createUserDto,
      passwordHash: await hash(createUserDto.password, 10),
    });

    return user.save();
  }

  async isValidPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await compare(password, passwordHash);
  }

  filterUser(user: User): FilteredUser {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
