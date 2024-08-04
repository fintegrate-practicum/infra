import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSettingsService } from './serviceSettings.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceSettings } from '../schemas/serviceSettings.schema';

describe('ServiceSettingsService', () => {
  let service: ServiceSettingsService;
  let model: Model<ServiceSettings>;

  const mockServiceSettingsModel = {
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

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

  describe('createOrUpdate', () => {
    it('should create or update a service setting', async () => {
      const dto = { service_id: 1, settings_json: {} };
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(dto as any);

      expect(await service.createOrUpdate(dto)).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of service settings', async () => {
      const result = [{ service_id: 1, settings_json: {} }];
      jest.spyOn(model, 'find').mockResolvedValue(result as any);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single service setting', async () => {
      const dto = { service_id: 1, settings_json: {} };
      jest.spyOn(model, 'findOne').mockResolvedValue(dto as any);

      expect(await service.findOne(1)).toEqual(dto);
    });
  });
});
