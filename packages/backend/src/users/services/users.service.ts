import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeUserDto } from '../dto/change-user.dto';
import { MultipartFile } from 'fastify-multipart';
import { UploadsService } from 'src/uploads/services/uploads.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly uploadsService: UploadsService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id).exec();

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    if (await this.userModel.findOne({ email }).exec()) {
      throw new BadRequestException(
        `User with email "${email}" already exists`
      );
    }

    const user = new this.userModel({
      ...createUserDto,
      passwordHash: await this.hash(createUserDto.password),
    });

    return user.save();
  }

  async changeUser(
    userId: string,
    { email, firstName, lastName }: ChangeUserDto
  ) {
    if (email) {
      const foundUser = await this.getByEmail(email);
      if (foundUser) {
        throw new BadRequestException(
          `User with email "${email}" already exists`
        );
      }
    }

    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.updateOne({ email, firstName, lastName }).exec();
    return await this.userModel.findById(userId).exec();
  }

  async changeAvatar(userId: string, file: MultipartFile) {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarId: string | null = null;
    try {
      avatarId = await this.uploadsService.uploadFile(userId, file);
    } catch (error) {
      throw error;
    }

    if (user.avatarId) {
      await this.uploadsService.deleteFile(user.avatarId, userId);
    }

    await user.updateOne({ avatarId }).exec();
    return avatarId;
  }

  async deleteAvatar(userId: string) {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatarId) {
      await this.uploadsService.deleteFile(user.avatarId, userId);
      await user.updateOne({ avatarId: null }).exec();
    }
  }

  async changePassword(
    userId: string,
    { password, newPassword }: ChangePasswordDto
  ) {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await this.isValidPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new BadRequestException('Wrong password');
    }

    await user.updateOne({ passwordHash: await this.hash(newPassword) }).exec();
  }

  async isValidPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
