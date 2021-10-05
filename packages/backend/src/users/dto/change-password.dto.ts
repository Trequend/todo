import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  newPassword: string;
}
