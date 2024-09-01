import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ServiceConfigurationsDocument = ServiceConfigurations & Document;

@Schema()
export class Setting {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: any;
}

@Schema()
export class ServiceConfigurations {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  serviceName: string;

  @Prop({
    type: [Setting],
    required: true,
  })
  settings: Setting[];
}

export const ServiceConfigurationsSchema =
  SchemaFactory.createForClass(ServiceConfigurations);
