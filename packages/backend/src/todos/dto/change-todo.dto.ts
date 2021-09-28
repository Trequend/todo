import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ChangeTodoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MaxLength(512)
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
