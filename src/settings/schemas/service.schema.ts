import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
// import { SettingSchema } from "./setting.schema";
// import { Setting } from "./setting.schema";
export type ServiceDocument = HydratedDocument<Service>;
@Schema()
export class Service {
    @Prop({
        type: String,
        required: true,
    })
    Name: string;
    @Prop({
        type: String,
        required: true,
    })
    NameToView: string;
    @Prop()
  icon:string ;
  @Prop({
    type:String,
    required:true
})
  route:string;
//   @Prop({ type: Array })
//   settingService: Array<settingService>
}

export const ServicesSchema = SchemaFactory.createForClass(Service);