import { Test, TestingModule } from '@nestjs/testing';
import { ServiceConfigurationsController } from './serviceConfigurations.controller';
import { ServiceConfigurationsService } from '../services/serviceConfigurations.service';
import { CreateServiceConfigurationDTO } from '../dto/serviceConfiguration.dto';
import { ServiceConfigurations } from '../schemas/serviceConfigurations.schema';

describe('ServiceConfigurationsController', () => {
  let controller: ServiceConfigurationsController;
  let service: ServiceConfigurationsService;

  const mockServiceConfigurationsService = {
    updateOrCreate: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceConfigurationsController],
      providers: [
        {
          provide: ServiceConfigurationsService,
          useValue: mockServiceConfigurationsService,
        },
      ],
    }).compile();

    controller = module.get<ServiceConfigurationsController>(
      ServiceConfigurationsController,
    );
    service = module.get<ServiceConfigurationsService>(ServiceConfigurationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create or update a service configuration', async () => {
      const dto: CreateServiceConfigurationDTO = {
        serviceName: 'test-service',
        settings: [{ key: 'exampleKey', value: 'newValue' }],
      };
      const result: ServiceConfigurations = { ...dto } as any;

      jest.spyOn(service, 'updateOrCreate').mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of service configurations', async () => {
      const result: ServiceConfigurations[] = [
        { serviceName: 'test-service', settings: [] },
      ] as any;

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single service configuration', async () => {
      const serviceName = 'test-service';
      const dto: ServiceConfigurations = {
        serviceName,
        settings: [{ key: 'exampleKey', value: 'exampleValue' }],
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(dto);

      expect(await controller.findOne(serviceName)).toEqual(dto);
    });
  });
});
