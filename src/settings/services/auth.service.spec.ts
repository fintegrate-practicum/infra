import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService with real server calls', () => {
  let service: AuthService;
  let rabbitPublisherService: RabbitPublisherService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'AUTH0_DOMAIN':
                  return 'dev-14d7lww6ch5of26k.us.auth0.com';
                default:
                  return '';
              }
            }),
          },
        },
        {
          provide: RabbitPublisherService,
          useValue: {
            publishMessageToCommunication: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    rabbitPublisherService = module.get<RabbitPublisherService>(RabbitPublisherService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should create a user and notify successfully', async () => {
    const email = 'worker@example.com';
    const name = 'Mocke Worker';
    const password = 'password123!';
    const connections = [];
    const registrationLink = 'https://mockdomain/continue-registration?user_id=user-id';

    const sendNotificationToEmployeeSpy = jest
      .spyOn(service as any, 'sendNotificationToEmployee')
      .mockResolvedValue(undefined);
    const userId = await service.createUserInAuth0(email, name, password);
    console.log('created user id: ', userId);
    expect(userId).toBeDefined();
    expect(userId).toMatch(/^auth0\|/);
    expect(sendNotificationToEmployeeSpy).toHaveBeenCalledWith(
      email,
      name,
      registrationLink,
      connections,
    );
  }, 25000);
});
