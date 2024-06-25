import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop()
  type: string;

  @Prop({ default: false })
  active: boolean;

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
