
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Employee } from './employee.entity';
import { User } from './user.entity';
@Schema({ timestamps: true })
export class CurrentUser extends Document {

  @Prop()
  employee: Employee;

  @Prop()
  user: User;
}

export const CurrentUserSchema = SchemaFactory.createForClass(CurrentUser);

