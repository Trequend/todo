import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(256)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  password: string;
}
