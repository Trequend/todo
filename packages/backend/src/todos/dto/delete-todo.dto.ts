import { IsString } from 'class-validator';

export class DeleteTodoDto {
  @IsString()
  id: string;
}
