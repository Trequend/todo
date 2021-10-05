import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ChangeUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(256)
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(256)
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(256)
  lastName?: string;
}
