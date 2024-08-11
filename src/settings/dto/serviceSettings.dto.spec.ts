import { validate } from 'class-validator';
import { CreateServiceSettingsDto } from './serviceSettings.dto';

describe('CreateServiceSettingsDto', () => {
  it('should validate valid DTO', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.service_name = 'test-service'; // עדכון ל-string תקני
    dto.settings_json = { key: 'value' };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if service_name is missing', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.settings_json = { key: 'value' };

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('service_name');
  });

  it('should fail validation if settings_json is missing', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.service_name = 'test-service';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('settings_json');
  });
});
