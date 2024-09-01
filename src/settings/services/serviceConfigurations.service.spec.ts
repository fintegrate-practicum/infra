import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ServiceConfigurationsService } from './serviceConfigurations.service';
import { ServiceConfigurations } from '../schemas/serviceConfigurations.schema';

const mockServiceConfigurations = {
  serviceName: 'test-service',
  settings: [{ key: 'exampleKey', value: 'exampleValue' }],
  save: jest.fn().mockResolvedValue(this),
};

const mockServiceConfigurationsModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockServiceConfigurations]),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockServiceConfigurations),
  }),
  save: jest.fn().mockResolvedValue(mockServiceConfigurations),
  findOneAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockServiceConfigurations),
  }),
};

describe('ServiceConfigurationsService', () => {
  let service: ServiceConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceConfigurationsService,
        {
          provide: getModelToken(ServiceConfigurations.name),
          useValue: mockServiceConfigurationsModel,
        },
      ],
    }).compile();

    service = module.get<ServiceConfigurationsService>(ServiceConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create or update a service configuration', async () => {
    const newSettings = [{ key: 'exampleKey', value: 'newValue' }];

    const updatedConfiguration = {
      ...mockServiceConfigurations,
      settings: newSettings,
    };

    mockServiceConfigurationsModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockServiceConfigurations),
    });

    mockServiceConfigurations.save = jest.fn().mockResolvedValue(updatedConfiguration);

    const result = await service.updateOrCreate('test-service', newSettings);
    expect(result).toEqual(updatedConfiguration);
  });

  it('should return an array of service configurations', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockServiceConfigurations]);
  });

  it('should return a single service configuration', async () => {
    const result = await service.findOne('test-service');
    expect(result).toEqual(mockServiceConfigurations);
  });
});
