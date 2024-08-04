// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { Settings, SettingsSchema } from './settings.schema';

// export type ServiceSettingsDocument = ServiceSettings & Document;

// @Schema()
// export class ServiceSettings {
//   @Prop({
//     type: Number,
//     required: true,
//     unique: true,
//   })
//   service_id: number;

//   @Prop({
//     type: String,
//     required: true,
//   })
//   settings_json: Any;
// }

// export const ServiceSettingsSchema = SchemaFactory.createForClass(ServiceSettings);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ServiceSettingsDocument = ServiceSettings & Document;

@Schema()
export class ServiceSettings {
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  service_id: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  settings_json: any;
}

export const ServiceSettingsSchema = SchemaFactory.createForClass(ServiceSettings);
