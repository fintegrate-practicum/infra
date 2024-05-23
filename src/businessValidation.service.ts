import { Injectable } from "@nestjs/common";
import validator from "email-validator";
// const validator = require("email-validator");

@Injectable()
export class BusinessValidationService {
  // constructor(
  //     @InjectModel('Organization') private readonly businessModel: Model<Organization>,
  // ) { }

  validateBusinessStep1(id: string, email: string): string {
    if (!validator.validate(email)) return "Invalid email";
    // if(!this.businessModel.find({email}))
    //     return 'email exist';
    // if(!this.businessModel.find({Id}))
    //     return 'business id exist';
    return "good details";
  }
}
