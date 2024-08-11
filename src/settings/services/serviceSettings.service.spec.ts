import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceSettingsService } from './serviceSettings.service';
import { ServiceSettings } from '../schemas/serviceSettings.schema';
import { CreateServiceSettingsDto } from '../dto/serviceSettings.dto';

const mockServiceSettings = {
  service_name: 'test-service',
  settings_json: 'example',
};

const mockServiceSettingsModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockServiceSettings]),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockServiceSettings),
  }),
  findOneAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockServiceSettings),
  }),
};

describe('ServiceSettingsService', () => {
  let service: ServiceSettingsService;
  let model: Model<ServiceSettings>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceSettingsService,
        {
          provide: getModelToken(ServiceSettings.name),
          useValue: mockServiceSettingsModel,
        },
      ],
    }).compile();

    service = module.get<ServiceSettingsService>(ServiceSettingsService);
    model = module.get<Model<ServiceSettings>>(getModelToken(ServiceSettings.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create or update a service setting', async () => {
    const dto: CreateServiceSettingsDto = {
      service_name: 'test-service',
      settings_json: 'example',
    };
    const result = await service.createOrUpdate(dto);
    expect(result).toEqual(mockServiceSettings);
  });

  it('should return an array of service settings', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockServiceSettings]);
  });

  it('should return a single service setting', async () => {
    const result = await service.findOneByServiceName('test-service');
    expect(result).toEqual(mockServiceSettings);
  });
});
