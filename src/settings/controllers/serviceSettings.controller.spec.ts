import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSettingsController } from './serviceSettings.controller';
import { ServiceSettingsService } from '../services/serviceSettings.service';
import { CreateServiceSettingsDto } from '../dto/serviceSettings.dto';
import { ServiceSettings } from '../schemas/serviceSettings.schema';

describe('ServiceSettingsController', () => {
  let controller: ServiceSettingsController;
  let service: ServiceSettingsService;

  const mockServiceSettingsService = {
    createOrUpdate: jest.fn(),
    findAll: jest.fn(),
    findOneByServiceName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceSettingsController],
      providers: [
        {
          provide: ServiceSettingsService,
          useValue: mockServiceSettingsService,
        },
      ],
    }).compile();

    controller = module.get<ServiceSettingsController>(ServiceSettingsController);
    service = module.get<ServiceSettingsService>(ServiceSettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service setting', async () => {
      const dto: CreateServiceSettingsDto = {
        service_name: 'test-service',
        settings_json: {},
      };
      const result: ServiceSettings = { ...dto } as any;
      jest.spyOn(service, 'createOrUpdate').mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of service settings', async () => {
      const result: ServiceSettings[] = [
        { service_name: 'test-service', settings_json: {} },
      ] as any;
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOneByServiceName', () => {
    it('should return a single service setting', async () => {
      const serviceName = 'test-service';
      const dto: ServiceSettings = {
        service_name: serviceName,
        settings_json: {},
      } as any;
      jest.spyOn(service, 'findOneByServiceName').mockResolvedValue(dto);

      expect(await controller.findOneByServiceName(serviceName)).toEqual(dto);
    });
  });
});
