import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
}

export const ServicesSchema = SchemaFactory.createForClass(Service);