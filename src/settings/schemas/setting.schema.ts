import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Setting extends Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  settingDesc: string;

  @Prop({ required: true })
  typeInput: string; 

  @Prop({ required: true, type: String })
  service_id: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
