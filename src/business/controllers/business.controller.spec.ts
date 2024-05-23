import { Test, TestingModule } from "@nestjs/testing";
import { businessController } from "../controllers/business.controller";
import { businessService } from "../services/business.service";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../tdo/create-busin-secons.dto";

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

  describe("remove", () => {
    const id = "popop";
    beforeEach(async () => {
      jest.spyOn(service, "deleteBusinessById");
      result = await controller.deleteBusinessById(id);
    });
    it("should called service.remove with id", () => {
      expect(service.deleteBusinessById).toBeCalledWith(id);
    });
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


  describe("update", () => {

    const id = "popop";
    const taskData: CreateBusinessDtoLevel2 = {
      description: "string",
      logo: "string",
      phone: "string",
      establishmentDate: "string"
    };
    beforeEach(async () => {
      jest.spyOn(service, "updateBusinessById");
      result = await controller.updateBusinessById(id, taskData);
    });
    it("should call service.update with id and dto", () => {
      expect(service.updateBusinessById);
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      jest.spyOn(service, "findAll");
      result = await controller.findAll();
    });
    it("should call serivce.find with orgId", () => {
      expect(service.findAll);
    });
  });

  const id = "popop";
  let result;

  describe("getBusinessById", () => {
    const id = "popop";
    beforeEach(async () => {
      jest.spyOn(service, "getBusinessById");
      result = await controller.getBusinessById(id);
    });
    it("should call service.findOne with id", () => {
      expect(service.getBusinessById);
    });
  });
});
