// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { HydratedDocument, SchemaTypes, Types } from "mongoose";
// import { Setting } from "./setting.schema";

// export type settingServiceDocument = HydratedDocument<settingService>;

// @Schema()
// export class settingService {

//   @Prop({ 
//     type: SchemaTypes.ObjectId,
//     required: true,
//     auto: true,
//   })
//   service_id: Types.ObjectId;


//   @Prop({
//     type: String,
//     required: true,
//   })
//   settingServiceName: string;

//   @Prop()
//   settings: Setting[];

//   @Prop()
//   subsettingService: settingService[];
// }

// export const settingServiceSchema = SchemaFactory.createForClass(settingService);
