import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
  @Prop()
  userName: string;

  @Prop()
  userEmail: string;

  @Prop()
  auth0_user_id: string;

  @Prop()
  registeredAt: Date;

  @Prop()
  lastLogin: Date;

  @Prop()
  mobile: string;

  @Prop({ enum: ['Married', 'divorcee', 'widower', 'Bachelor'] })
  status: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ type: Object })
  address: {
    city: string;
    street: string;
    num: number;
  };

  @Prop()
  phone: string;

  @Prop({
    type: [
      {
        businessId: String,
        role: { type: String, enum: ['admin', 'employee', 'client'] },
      },
    ],
    default: [],
  })
  businessRoles: {
    businessId: string;
    role: 'admin' | 'employee' | 'client';
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
