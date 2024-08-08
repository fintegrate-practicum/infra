import { validate } from 'class-validator';
import { CreateServiceSettingsDto } from './serviceSettings.dto';

describe('CreateServiceSettingsDto', () => {
  it('should validate valid DTO', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.service_id = 1;
    dto.settings_json = { key: 'value' };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if service_id is missing', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.settings_json = { key: 'value' };

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('service_id');
  });

  it('should fail validation if settings_json is missing', async () => {
    const dto = new CreateServiceSettingsDto();
    dto.service_id = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('settings_json');
  });
});
