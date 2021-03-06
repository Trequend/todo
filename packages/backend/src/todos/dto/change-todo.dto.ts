import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeTodoDto {
  @IsString()
  @MaxLength(512)
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
