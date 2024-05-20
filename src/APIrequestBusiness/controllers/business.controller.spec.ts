import { Test, TestingModule } from '@nestjs/testing';
import { businessController } from '../controllers/business.controller';
import { businessService } from '../services/business.service';
import { CreateTaskDto } from '../tdo/create-busin.dto';
// import { Organization } from '../schema/organization.entity';
describe('TasksController', () => {
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
            deleteBusinessByName:jest.fn(),
            getBusinessByName:jest.fn(),
            findAll:jest.fn(),
            updateBusiness:jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<businessController>(businessController);
    service = module.get<businessService>(businessService);
  });
  describe('create', () => {
    it('should call service.createTask with managerId and dto', async () => {
      const taskData: CreateTaskDto = {
        description: 'Test description',
        name: 'name',
        logo: '2logologologo',
        phone: 'phone',
        owner: 3,
        businessSize: "businessSize",
        industryType: "industryType",
        establishmentDate: "establishmentDate"
      };

      const spy = jest.spyOn(service, 'createBusiness').mockResolvedValue(taskData);
      const result = await controller.createBusiness(taskData);
      expect(spy).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(taskData);
    });
    it('result should be equal to TaskStub', async () => {
      const taskData: CreateTaskDto = {
        description: 'Test description',
        name: 'name',
        logo: '2logologologo',
        phone: 'phone',
        owner: 3,
        businessSize: "businessSize",
        industryType: "industryType",
        establishmentDate: "establishmentDate"
      };
      const taskStub = { ...taskData };
      jest.spyOn(service, 'createBusiness').mockResolvedValue(taskStub);
      const result = await controller.createBusiness(taskData);
      expect(result).toEqual(taskStub);
    });
  });
  describe('delete', () => {
    it('should call service.createTask with managerId and dto', async () => {
      const name = 'namename'
      const spy = jest.spyOn(service, 'deleteBusinessByName').mockResolvedValue(name);
      jest.spyOn(service, 'deleteBusinessByName');
      const result = await controller.deleteBusinessByName(name);
      expect(spy).toHaveBeenCalledWith(name);
      expect(result).toEqual(name);
    });
    it('should call service.createTask with managerId and dto', async () => {
      const name = "1"
      const spy = jest.spyOn(service, 'deleteBusinessByName').mockResolvedValue(name);
      jest.spyOn(service, 'deleteBusinessByName');
      const result = await controller.deleteBusinessByName(name);
      expect(spy).toHaveBeenCalledWith(name);
      expect(result).toEqual(name);
    });
  });
  describe('getByName', () => {
    it('should call service.createTask with managerId and dto', async () => {
      const name = 'namename'
      const spy = jest.spyOn(service, 'getBusinessByName').mockResolvedValue(name);
      jest.spyOn(service, 'getBusinessByName');
      const result = await controller.getBusinessByName(name);
      expect(spy).toHaveBeenCalledWith(name);
      expect(result).toEqual(name);
    });
  });
  // describe('findAll', () => {
  //   it('should call service.createTask with managerId and dto', async () => {
  //     const spy = jest.spyOn(service, 'findAll').mockResolvedValue();
  //     jest.spyOn(service, 'findAll');
  //     const result = await controller.findAll();
  //     expect(spy).toHaveBeenCalledWith();
  //     expect(result).toEqual();
  //   });
  // });
  // describe('update', () => {
  //   it('should call service.createTask with managerId and dto', async () => {
  //     const name = 'namename'
  //     const taskData: CreateTaskDto = {
  //       description: 'Test description',
  //       name: 'name',
  //       logo: '2logologologo',
  //       phone: 'phone',
  //       owner: 3,
  //       businessSize: "businessSize",
  //       industryType: "industryType",
  //       establishmentDate: "establishmentDate"
  //     };

  //     const spy = jest.spyOn(service, 'updateBusiness').mockResolvedValue(taskData);
  //     const result = await controller.updateBusiness(name,taskData);
  //     expect(spy).toHaveBeenCalledWith(taskData);
  //     expect(result).toEqual(taskData);
  //   });
  //   it('result should be equal to TaskStub', async () => {
  //     const name :string='namessname'

  //     const taskData: CreateTaskDto = {
  //       description: 'Test description',
  //       name: 'name',
  //       logo: '2logologologo',
  //       phone: 'phone',
  //       owner: 3,
  //       businessSize: "businessSize",
  //       industryType: "industryType",
  //       establishmentDate: "establishmentDate"
  //     };
  //     const taskStub = { ...taskData };
  //     jest.spyOn(service, 'updateBusiness').mockResolvedValue(name);
  //     const result = await controller.updateBusiness(name,taskData);
  //     expect(result).toEqual(taskStub);
  //   });
  // });
});