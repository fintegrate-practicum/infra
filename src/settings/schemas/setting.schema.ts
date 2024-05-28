import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { InputType } from "../input-settings.enum";

export type SettingDocument = HydratedDocument<Setting>;

@Schema()
export class Setting {
  @Prop({
    type: String,
    enum: InputType})
  typeInput: InputType;

  @Prop()
  settingDesc: string;

  @Prop()
  options: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
