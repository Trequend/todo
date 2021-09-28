import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, maxlength: 512 })
  text: string;

  @Prop({ required: true })
  done: boolean;

  @Prop({ expires: 0 })
  deleted: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
