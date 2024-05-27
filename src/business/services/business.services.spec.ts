import { Test, TestingModule } from "@nestjs/testing";
import { businessService } from "./business.service";
import { getModelToken } from "@nestjs/mongoose";
import { Organization } from "../schema/organization.entity";
// import { Model } from "mongoose";
describe("BusinessService", () => {
  let service: businessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        businessService,
        {
          provide: getModelToken(Organization.name),
          useValue: {
            new: jest.fn().mockResolvedValue({ save: jest.fn() }),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<businessService>(businessService);
    // const model = module.get<Model<Organization>>(
    //   getModelToken(Organization.name),
    // );
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
