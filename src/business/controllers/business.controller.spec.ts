import { Test, TestingModule } from "@nestjs/testing";
import { businessController } from "../controllers/business.controller";
import { businessService } from "../services/business.service";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";

describe("BusinessController", () => {
  let controller: businessController;
  let service: businessService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [businessController],
      providers: [
        {
          provide: businessService,
          useValue: {
            createBusiness: jest.fn(),
            deleteBusinessById: jest.fn(),
            findAll: jest.fn(),
            updateBusinessById: jest.fn(),
            getBusinessById: jest.fn(),
            createBusinessLevel2: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<businessController>(businessController);
    service = module.get<businessService>(businessService);
  });

  describe("create", () => {
    it("should call service.createTask with managerId and dto", async () => {
      const taskData: CreateBusinessDto = {
        id: "iiiddd0",
        name: "name",
        owner: 3,
        email: "poijhh@",
      };
      const spy = jest
        .spyOn(service, "createBusiness")
        .mockResolvedValue(taskData);
      const result = await controller.createBusiness(taskData);
      expect(spy).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(taskData);
    });
    it("result should be equal to TaskStub", async () => {
      const taskData: CreateBusinessDto = {
        id: "idididid",
        name: "name",
        owner: 3,
        email: "poijhh@",
      };
      const taskStub = { ...taskData };
      jest.spyOn(service, "createBusiness").mockResolvedValue(taskStub);
      const result = await controller.createBusiness(taskData);
      expect(result).toEqual(taskStub);
    });
  });
});
