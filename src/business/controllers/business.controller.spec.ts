import { Test, TestingModule } from '@nestjs/testing';
import { businessController } from '../controllers/business.controller';
import { BusinessService } from '../services/business.service';
import { CreateBusinessDto } from '../dto/create-busin-first.dto';
import { VerificationService } from 'src/verification/vertification.services';
describe('BusinessController', () => {
  let controller: businessController;
  let service: BusinessService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [businessController],
      providers: [
        {
          provide: BusinessService,
          useValue: {
            createBusiness: jest.fn(),
            deleteBusinessById: jest.fn(),
            findAll: jest.fn(),
            updateBusinessById: jest.fn(),
            getBusinessById: jest.fn(),
            createBusinessLevel2: jest.fn(),
          },
        },
        {
          provide: VerificationService,
          useValue: {},
        },
      ],
    }).compile();
    controller = module.get<businessController>(businessController);
    service = module.get<BusinessService>(BusinessService);
  });
  describe('create', () => {
    it('should call service.createBusiness with managerId and dto', async () => {
      const bussiness: CreateBusinessDto = {
        companyNumber: 'iiiddd0',
        name: 'name',
        email: 'poijhh@',
      };
      const spy = jest.spyOn(service, 'createBusiness').mockResolvedValue(bussiness);
      const result = await controller.createBusiness(bussiness);
      expect(spy).toHaveBeenCalledWith(bussiness);
      expect(result).toEqual(bussiness);
    });
    it('result should be equal to TaskStub', async () => {
      const bussiness: CreateBusinessDto = {
        companyNumber: 'idididid',
        name: 'name',
        email: 'poijhh@',
      };
      const createBussiness = { ...bussiness };
      jest.spyOn(service, 'createBusiness').mockResolvedValue(createBussiness);
      const result = await controller.createBusiness(bussiness);
      expect(result).toEqual(createBussiness);
    });
  });
});
