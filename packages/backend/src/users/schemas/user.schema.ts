import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, maxlength: 256, unique: true })
  email: string;

  @Prop({ required: true, maxlength: 256 })
  firstName: string;

  @Prop({ required: true, maxlength: 256 })
  lastName: string;

  @Prop({ required: true, maxlength: 256 })
  passwordHash: string;

  @Prop()
  avatarId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
