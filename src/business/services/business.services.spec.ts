import { Test, TestingModule } from "@nestjs/testing";
import { BusinessService } from "./business.service";
import { getModelToken } from "@nestjs/mongoose";
import { Organization } from "../schema/organization.entity";

describe("BusinessService", () => {
  let service: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: getModelToken(Organization.name),
          useValue: {
            new: jest.fn().mockResolvedValue({ save: jest.fn() }),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<BusinessService>(BusinessService);
    // const model = module.get<Model<Organization>>(
    //   getModelToken(Organization.name),
    // );
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
