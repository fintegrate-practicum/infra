import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class VerificationCode extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  // @Prop({ type: Date, required: true })
  // createdAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);

// import { Schema, Document } from 'mongoose';

// export const VerificationCodeSchema = new Schema({
//   email: { type: String, required: true },
//   code: { type: String, required: true },
//   expiresAt: { type: Date, required: true },
// });

// export interface BusinessService extends Document {
//   email: string;
//   code: string;
//   expiresAt: Date;
// }
