// import { Model } from "mongoose";
// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { settingService } from "../schemas/settingService.schema";
// import { CreatesettingServiceDto } from "../dto/settingService.dto";
// import { Setting } from "../schemas/setting.schema";
// @Injectable()
// export class settingServiceService {
//     constructor(
//         @InjectModel(settingService.name) private settingServiceModel: Model<settingService>,
//         @InjectModel(Setting.name) private SettingModel: Model<Setting>,
//     ) { }
//     async create(createsettingServiceDto: CreatesettingServiceDto): Promise<settingService> {
//         const { settings,...settingServiceData } = createsettingServiceDto;
//         const settingPromises = settings.map(async setting => {
//             const newSetting = new this.SettingModel(setting);
//             return await newSetting.save();
//         });
//         // const subsettingServicePromises = subsettingService.map(async sub => {
//         //     const newSubsettingService = new this.settingServiceModel(sub);
//         //     return await newSubsettingService.save();
//         // });
//         const createdSettings = await Promise.all(settingPromises);
//         // const createdSubsettingService = await Promise.all(subsettingServicePromises);
//         const createdsettingService = new this.settingServiceModel({
//             ...settingServiceData,
//             settings: createdSettings.map(setting => setting._id),
//             // subsettingService:createdSubsettingService.map(sub=>sub._id)
//         });
//         return await createdsettingService.save();
//     }
//     async findAll(): Promise<settingService[]> {
//         return this.settingServiceModel.find().exec();
//     }

//   async findById(id: string): Promise<settingService | null> {
//     return await this.settingServiceModel.findById(id).populate('settings').exec(); // Populate settings
//   }

//   async update(id: string, updatesettingServiceDto: CreatesettingServiceDto): Promise<settingService | null> {
//     const { settings, ...settingServiceData } = updatesettingServiceDto;

//     const updatedsettingService = await this.settingServiceModel.findByIdAndUpdate(
//       id,
//       settingServiceData,
//       { new: true },
//     ).populate('settings'); // Populate settings

//     return updatedsettingService;
//   }

//   async delete(id: string): Promise<void> {
//     await this.settingServiceModel.findByIdAndDelete(id); // Delete the settingService
//   }
// }

// export { settingService };
