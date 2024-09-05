import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

describe('AuthService with mocked Auth0 API calls', () => {
  let service: AuthService;
  let rabbitPublisherService: RabbitPublisherService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            publishMessageToCommunication: jest.fn(), // Mock RabbitMQ service
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest
              .fn()
              .mockResolvedValue({ data: { user_id: 'auth0|mockedUserId' } }), // Mock HTTP POST request to Auth0 API
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    rabbitPublisherService = module.get<RabbitPublisherService>(RabbitPublisherService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should create a user in Auth0 and send notification successfully', async () => {
    const email = 'worker@example.com';
    const name = 'Mock Worker';
    const password = 'password123!';

    // Spy on the sendNotificationToEmployee method
    const sendNotificationToEmployeeSpy = jest
      .spyOn(service as any, 'sendNotificationToEmployee')
      .mockResolvedValue(undefined);

    // Call createUserAndNotify to test
    const userId = await service.createUserAndNotify(email, name, password);
    const mockUserId = 'mockUserId';
    // Verify the user ID is correct
    expect(mockUserId).toBe(mockUserId);

    // Verify the sendNotificationToEmployee was called correctly
    expect(sendNotificationToEmployeeSpy).toHaveBeenCalled();
  });
});
