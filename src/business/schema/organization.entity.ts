import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop()
  companyNumber: string;

  @Prop()
  description: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  logo: string;

  @Prop()
  phone: string;

  // @Prop()
  // address: {
  //   city: string;
  //   street: string;
  //   num: number;
  // };

  @Prop()
  owner: string;

  @Prop({ enum: ["Private", "public", "International", "global"] })
  businessSize: string;

  @Prop()
  industryType: string;

  @Prop()
  establishmentDate: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
