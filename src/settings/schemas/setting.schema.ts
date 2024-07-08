import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type SettingDocument = HydratedDocument<Setting>;

@Schema()
export class Setting {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  service_id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Map,
    of: MongooseSchema.Types.Mixed,
    default: {},
  })
  setting_json: Record<string, any>;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
