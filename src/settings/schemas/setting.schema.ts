import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { InputType } from "../input-settings.enum";

export type SettingDocument = HydratedDocument<Setting>;

@Schema()
export class Setting {
  @Prop({
    type: String,
    enum: InputType,
    required: true,
  })
  typeInput: InputType;

  @Prop({
    type: String,
    required: true,
  })
  settingDesc: string;

  @Prop({ type: Map, of: String })
  props: Record<string, any>;

  @Prop({ type: Array })
  children: Array<Record<string, any>>;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
